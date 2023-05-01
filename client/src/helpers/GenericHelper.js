import Cookies from "js-cookie";

class GenericHelper {
  getAccessToken () {
    return Cookies.get('token');
  }
}

const genericHelper = new GenericHelper();
export default genericHelper;