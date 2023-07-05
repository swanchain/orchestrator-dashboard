import store from '../store'
import axios from 'axios'
import moment from 'moment'
import {
  ElMessage
} from 'element-plus'

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
    messageTip('error', err.response ? err.response.statusText : 'Request failed. Please try again later!')
    if (err.response.status === 401) {
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

async function momentFun(dateItem) {
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

export default {
  sendRequest,
  timeout,
  messageTip,
  momentFun,
  copyContent
}