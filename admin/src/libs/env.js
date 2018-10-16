/**
 *  配置编译环境和线上环境之间的切换
 */
import Env from '../../build/env';

let baseUrl = '';
let imgBaseUrl = '';

if (Env === 'development') {
    // baseUrl = 'https://www.edumessage.xyz';
    baseUrl = 'http://127.0.0.1:3000';
    imgBaseUrl = '';
} else if (Env === 'production') {
    baseUrl = 'https://www.edumessage.xyz';
    imgBaseUrl = '';
}

export {
    baseUrl,
    imgBaseUrl
};
