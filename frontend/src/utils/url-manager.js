export class UrlManager {
    static getQueryParams() {
        const qs = document.location.hash.split('+').join(' ');

        let params = {},
            tokens,
            re = /[?&]([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }

    // static function checkUserData(params) {
//     if (!params.name || !params.lastName || !params.email) {
//         location.href = '#/';
//     }
// }
    static checkUserData() {
        if (!sessionStorage.getItem('name') || !sessionStorage.getItem('lastName') ||
            !sessionStorage.getItem('email')) {
            location.href = '#/';
        }
    }
}