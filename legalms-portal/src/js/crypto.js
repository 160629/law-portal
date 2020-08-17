window.AES = {};
var keygen="fawu_portal&lega";

AES.encrypt=function encrypt(content) {
    var key = CryptoJS.enc.Utf8.parse(keygen);
    var srcs = CryptoJS.enc.Utf8.parse(content);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

AES.decrypt=function decrypt(content) {
    var key = CryptoJS.enc.Utf8.parse(keygen);
    var basestr=CryptoJS.enc.Base64.parse(content);   // Base64解密
    var ciphertext=CryptoJS.enc.Base64.stringify(basestr);     // Base64解密
    var decryptResult = CryptoJS.AES.decrypt(ciphertext,key, {    //  AES解密
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decryptResult.toString(CryptoJS.enc.Utf8).toString();
};

