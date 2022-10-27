import axios from 'axios'

/**
 * 封装axios
 * @param url 请求地址
 * @param params 传递参数 格式：{ name:'张三',age:18,sex:'男'}
 * @param type 请求方式
 * @returns {Promise<unknown>} 最终返回一个Promis
 * {
 *
 * }
 */
export default function ajax(url = '', params = {}, type = 'GET') {
    // 1 定义变量，接收最终输出
    let promise;
    // 2 返回一个promise对象
    return new Promise((resolve, reject) => {
        // 2.1 请求类型
        if (type.toUpperCase() === 'GET') {
            // get 请求 如果是get请求，url最终为 baseURL?name=张三&age=18&sex=男
            // 2.2 拼接字符串
            let paramsStr = '';
            // 2.3 遍历
            Object.keys(params).forEach(key => {
                paramsStr += key + '=' + params[key] + '&';
            });
            // 2.4 过滤最后的&
            /*
              注意：为了防止请求缓存，在尾部加了时间戳
            */
            if (paramsStr) {
                paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'));
                // 2.5 拼接完整路径
                if (url.indexOf('47.98.157.152') === -1) {
                    url += '?' + paramsStr + '&itlike=' + randomCode(20);
                } else {
                    url += '?' + paramsStr;
                }
            } else {
                if (url.indexOf('47.98.157.152') === -1) {
                    url += '?itlike=' + randomCode(20)
                }
            }
            // 2.6 发起get请求
            promise = axios.get(url);
        } else if (type.toUpperCase() === 'POST') {
            // post 请求
            // 2.7 发起post请求
            promise = axios.post(url, params);
        }
        // 2.8 处理结果并返回
        promise.then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

/*生成指定长度的随机数*/
function randomCode(length) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = "";
    for (let i = 0; i < length; i++) {
        let index = Math.ceil(Math.random() * 9);
        result += chars[index];
    }
    return result;
}