import store from '../store'
import axios from 'axios'
import moment from 'moment'
import {
  ElMessage
} from 'element-plus'
import router from '../router'
let lastTime = 0

async function sendRequest(apilink, type, jsonObject, api_token) {
  // signOutFun()
  // axios.defaults.timeout = 60000
  axios.defaults.headers.common['Authorization'] = `Bearer ${api_token?api_token:store.state.accessToken}`
  try {
    let response
    switch (type) {
      case 'post':
        response = await axios.post(apilink, jsonObject)
        return response.data
      case 'put':
        response = await axios.put(apilink, jsonObject)
        return response.data
      case 'get':
        response = await axios.get(apilink)
        return response.data
      case 'delete':
        response = await axios.delete(apilink, {
          data: jsonObject
        })
        return response.data
    }
  } catch (err) {
    console.error(err, err.response)
    const time = await throttle()
    const text = err.response ? err.response.data.msg || err.response.data.message || '' : ''
    if (time) messageTip('error', err.response ? text || err.response.statusText : 'Request failed. Please try again later!')
    if (err.response && err.response.status === 401) {
      signOutFun()
    } else if (err.response) {
      // The request has been sent, but the status code of the server response is not within the range of 2xx
      // console.log(err.response.data)
      // console.log(err.response.status)
      // console.log(err.response.headers)
      return err.response.data
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', err.message)
      return err
    }
  }
}

async function timeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

async function messageTip(type, text) {
  ElMessage({
    showClose: true,
    message: text,
    type: type,
  })
}

function momentFun(dateItem) {
  let dateNew = dateItem * 1000
  let dataUnit = ''
  let dataTime = new Date(dateNew) + ''
  let dataUnitIndex = dataTime.indexOf('GMT')
  let dataUnitArray = dataTime.substring(dataUnitIndex, dataUnitIndex + 8)
  switch (dataUnitArray) {
    case 'GMT+1000':
      dataUnit = 'UTC+10'
      break
    case 'GMT-1000':
      dataUnit = 'UTC-10'
      break
    case 'GMT+0000':
      dataUnit = 'UTC+0'
      break
    default:
      dataUnit = dataUnitArray ? dataUnitArray.replace(/0/g, '').replace('GMT', 'UTC') : '-'
      break
  }
  dateNew = dateNew ?
    moment(new Date(parseInt(dateNew))).format('YYYY-MM-DD HH:mm:ss') + ` (${dataUnit})` :
    '-'
  return dateNew
}

function copyContent(text, tipCont) {
  var txtArea = document.createElement('textarea')
  txtArea.id = 'txt'
  txtArea.style.position = 'fixed'
  txtArea.style.top = '0'
  txtArea.style.left = '0'
  txtArea.style.opacity = '0'
  txtArea.value = text
  document.body.appendChild(txtArea)
  txtArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Copying text command was ' + msg)
    if (successful) {
      messageTip('success', tipCont)
      return true
    }
  } catch (err) {
    console.log('Oops, unable to copy')
  } finally {
    document.body.removeChild(txtArea)
  }
  return false
}
async function Init(callback) {
  if (typeof window.ethereum === 'undefined') {
    window.open('https://metamask.io/download.html')
    alert("Consider installing MetaMask!");
  } else {
    providerInit
      .request({
        method: 'eth_requestAccounts'
      })
      .then((accounts) => {
        if (!accounts) {
          return false
        }
        web3Init.eth.getAccounts().then(async webAccounts => {
            store.dispatch('setMetaAddress', webAccounts[0])
            // const chainId = await providerInit.request({ method: 'eth_chainId' })
            // console.log(parseInt(chainId, 16))
            callback(webAccounts[0])
          })
          .catch(async (error) => {
            store.dispatch('setMetaAddress', accounts[0])
            callback(accounts[0])
          })
      })
      .catch((error) => {
        if (error === "User rejected provider access") {} else {
          alert("Please unlock MetaMask and switch to the correct network.");
          return false
        }
        console.error(
          `Error fetching accounts: ${error.message}.
        Code: ${error.code}. Data: ${error.data}`
        );
      });
  }
  // else console.log('MetaMask installed:', window.ethereum.isMetaMask)
}

let web3Init
const providerInit = window.ethereum && window.ethereum.providers ? window.ethereum.providers.find((provider) => provider.isMetaMask) : window.ethereum
if (typeof window.ethereum === 'undefined') {
  // window.open('https://metamask.io/download.html')
  // alert("Consider installing MetaMask!");
} else {
  if (window.ethereum) {
    web3 = new Web3(providerInit);
    web3.setProvider(providerInit);
  } else if (window.web3) {
    web3 = window.web3;
    console.log("Injected web3 detected.");
  } else {
    var currentProvider = web3.currentProvider;
    web3 = new Web3(currentProvider);
    web3.setProvider(currentProvider);
    console.log("No web3 instance injected, using Local web3.");
  }
  web3Init = web3
}

async function walletChain(chainId) {
  let text = {}
  const currentID = await web3Init.eth.net.getId()
  switch (chainId) {
    case 8598668088:
      text = {
        chainId: web3Init.utils.numberToHex(8598668088),
        chainName: 'OpSwan',
        // nativeCurrency: {
        //   name: 'SWAN',
        //   symbol: 'SWAN', // 2-6 characters long
        //   decimals: 18
        // },
        rpcUrls: [process.env.VUE_APP_OPSWANRPCURL],
        blockExplorerUrls: [process.env.VUE_APP_OPSWANURL]
      }
      break
    case 2024:
      text = {
        chainId: web3Init.utils.numberToHex(2024),
        chainName: 'Saturn Testnet',
        nativeCurrency: {
          name: 'sETH',
          symbol: 'sETH', // 2-6 characters long
          decimals: 18
        },
        rpcUrls: [process.env.VUE_APP_SATURNURL],
        blockExplorerUrls: [process.env.VUE_APP_SATURNBLOCKURL]
      }
      break
      // case 80001:
      //   text = {
      //     chainId: web3Init.utils.numberToHex(80001),
      //     chainName: 'Mumbai Testnet',
      //     nativeCurrency: {
      //       name: 'MATIC',
      //       symbol: 'MATIC', // 2-6 characters long
      //       decimals: 18
      //     },
      //     rpcUrls: [process.env.VUE_APP_MUMBAIRPCURL],
      //     blockExplorerUrls: [process.env.VUE_APP_MUMBAIPAYMENTURL]
      //   }
      //   break
      // case 97:
      //   text = {
      //     chainId: web3Init.utils.numberToHex(97),
      //     chainName: 'BSC TestNet',
      //     nativeCurrency: {
      //       name: 'tBNB',
      //       symbol: 'tBNB', // 2-6 characters long
      //       decimals: 18
      //     },
      //     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
      //     blockExplorerUrls: [process.env.VUE_APP_BSCTESTNETBLOCKURL]
      //   }
      //   break
      // case 137:
      //   text = {
      //     chainId: web3Init.utils.numberToHex(137),
      //     chainName: 'Polygon Mainnet',
      //     nativeCurrency: {
      //       name: 'MATIC',
      //       symbol: 'MATIC', // 2-6 characters long
      //       decimals: 18
      //     },
      //     rpcUrls: ['https://polygon-rpc.com'],
      //     blockExplorerUrls: [process.env.VUE_APP_POLYGONBLOCKURL]
      //   }
      //   break
  }
  try {
    await providerInit.request({
      method: 'wallet_addEthereumChain',
      params: [
        text
      ]
    })
    await timeout(500)
    const newID = await web3Init.eth.net.getId()
    if (newID !== currentID) {
      router.push({
        name: 'dashboard'
      })
      await login()
    }
  } catch (err) {
    if (err.message) messageTip('error', err.message)
  }
}

async function login() {
  // if (chain_id !== 2024) return
  const chain_id = await web3Init.eth.net.getId()
  if (!store.state.metaAddress || store.state.metaAddress === undefined) {
    const accounts = await providerInit.request({
      method: 'eth_requestAccounts'
    })
    store.dispatch('setMetaAddress', accounts[0])
  }
  const time = await throttle()
  if (!time) return [false, '']
  const [signature, signErr] = await sign()
  if (!signature) return [false, signErr]
  const token = await performSignin(signature)
  return [!!token, '']
}

async function throttle() {
  // Prevent multiple signatures
  let now = new Date().valueOf();
  if (lastTime > 0 && (now - lastTime) <= 2000) return false
  lastTime = now
  return true
}

async function sign(nonce) {
  const rightnow = (Date.now() / 1000).toFixed(0)
  const sortanow = rightnow - (rightnow % 600)
  const local = process.env.VUE_APP_DOMAINNAME
  const buff = Buffer.from("Signing in to " + local + " at " + sortanow, 'utf-8')
  let signature = null
  let signErr = ''
  await providerInit.request({
    method: 'personal_sign',
    params: [buff.toString('hex'), store.state.metaAddress]
  }).then(sig => {
    signErr = ''
    signature = sig
  }).catch(err => {
    console.log(err)
    signature = ''
    signErr = err && err.code ? String(err.code) : err
    signOutFun()
  })
  return [signature, signErr]
}

async function performSignin(sig) {
  try {
    const reqOpts = [store.state.metaAddress, sig]
    const response = await sendRequest(`${process.env.VUE_APP_BASEAPI}login`, 'post', reqOpts)
    if (response && response.access_token) {
      store.dispatch('setAccessToken', response.access_token)
      return true
    } else signOutFun()
    messageTip('error', response ? response.message : 'Fail')
    return null
  } catch (err) {
    console.log('login err:', err)
    messageTip('error', 'Fail')
    signOutFun()
    return null
  }
}

async function signOutFun() {
  store.dispatch('setAccessToken', '')
  // store.dispatch('setMetaAddress', '')
}

function hiddAddress(val) {
  if (val) return `${val.substring(0, 5)}...${val.substring(val.length - 5)}`
  else return '-'
}

function expiredTime(validDays) {
  if (String(validDays) === '0') return 'Forever'
  else if (validDays === undefined) return '-'
  else return momentFun(validDays)
}

function sizeChange(bytes) {
  if (bytes === 0) return '0 B'
  if (!bytes) return '-'
  var k = 1024 // or 1000
  var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))

  if (Math.round((bytes / Math.pow(k, i))).toString().length > 3) i += 1
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function byteStorage(limit) {
  if (limit <= 0) {
    return '0'
  } else {
    return (limit / (1024 * 1024 * 1024)).toFixed(2) //or 1000
  }
}

function storageNumformat(data) {
  if (!data) return
  let dataList = data.split(' ')
  dataList[0] = parseFloat(dataList[0]).toFixed(2)
  return dataList[1] ? `${dataList[0]} ${dataList[1]}` : dataList[0]
}

function filNumformat(data) {
  if (!data) return
  const price_regular = data ? data.split(" ") : []
  return `${replaceFormat(price_regular[0] * 365)} FIL/GiB/year` || '0 FIL/GiB/year'
}

function timeFormat(data) {
  if (!data) return
  const d = data / 60 / 60
  return d < 0.001 ? 0 : d
}

async function getUnit(id) {
  let unit = 'ETH'
  let name = ''
  let url = ''
  let url_tx = ''
  switch (id) {
    case 1:
      unit = 'ETH'
      name = 'Ethereum Mainnet '
      break
    case 8598668088:
      unit = 'SwanETH'
      name = 'OpSwan '
      url = `${process.env.VUE_APP_OPSWANURL}/address/`
      url_tx = `${process.env.VUE_APP_OPSWANURL}/tx/`
      break
    case 2024:
      unit = 'sETH'
      name = 'Saturn Testnet '
      url = `${process.env.VUE_APP_SATURNBLOCKURL}/address/`
      url_tx = `${process.env.VUE_APP_SATURNBLOCKURL}/tx/`
      break
    default:
      unit = '-'
      name = `Chain ${id}`
      break
  }
  return ({
    unit,
    name,
    url,
    url_tx
  })
}

function goLink(link) {
  window.open(link)
}

async function checkNetwork() {
  const getnetID = await web3Init.eth.net.getId()
  if (getnetID !== 2024) {
    walletChain(2024)
    return true
  } else return false
}

function NumFormat(num) {
  try {
    if (num) return parseFloat(num).toFixed(2)
    else return '-'
  } catch {
    return '-'
  }
}

function replaceFormat(value) {
  try {
    if (String(value) === '0') return '0'
    else if (!value) return '-'
    var intPartArr = String(value).split('.')
    var intPartFormat = intPartArr[0]
      .toString()
      .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    return intPartArr[1] ? `${intPartFormat}.${intPartArr[1].slice(0, 2)}` : intPartFormat
  } catch {
    return '-'
  }
}

export default {
  sendRequest,
  timeout,
  messageTip,
  momentFun,
  copyContent,
  Init,
  web3Init,
  walletChain,
  login,
  signOutFun,
  hiddAddress,
  expiredTime,
  sizeChange,
  byteStorage,
  storageNumformat,
  filNumformat,
  timeFormat,
  getUnit,
  goLink,
  providerInit,
  checkNetwork,
  NumFormat,
  replaceFormat
}