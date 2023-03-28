import AppRestV1Service from "@/services/App/AppRestV1Service";

class Validators {
  static required(value) {
    return !!value || 'Required.'
  }

  static selected(value) {
    return value===true || 'Must be selected.'
  }

  static email(value) {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
}

export default Validators
