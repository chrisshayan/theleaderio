import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

/**
 * @summary toastr methods which are using https://atmospherejs.com/chrismbeckett/toastr
 * @success
 * @info
 * @warning
 * @error
 */

export const success = new ValidatedMethod({
  name: 'notifications.success',
  validate: new SimpleSchema({
    closeButton: {
      type: Boolean,
      optional: true
    },
    timeOut: {
      type: Number,
      optional: true
    },
    title: {
      type: String,
      optional: true
    },
    message: {
      type: String
    }
  }).validator(),
  run({closeButton, timeOut, title, message}) {
    if (this.isSimulation) {
      toastr.options = {
        "closeButton": closeButton,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr.success(message, title);
    }
  }
});

export const info = new ValidatedMethod({
  name: 'notifications.info',
  validate: new SimpleSchema({
    closeButton: {
      type: Boolean,
      optional: true
    },
    timeOut: {
      type: Number,
      optional: true
    },
    title: {
      type: String,
      optional: true
    },
    message: {
      type: String
    }
  }).validator(),
  run({closeButton, timeOut, title, message}) {
    if (this.isSimulation) {
      toastr.options = {
        "closeButton": closeButton,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr.info(message, title);
    }
  }
});

export const warning = new ValidatedMethod({
  name: 'notifications.warning',
  validate: new SimpleSchema({
    closeButton: {
      type: Boolean,
      optional: true
    },
    timeOut: {
      type: Number,
      optional: true
    },
    title: {
      type: String,
      optional: true
    },
    message: {
      type: String
    }
  }).validator(),
  run({closeButton, timeOut, title, message}) {
    if (this.isSimulation) {
      toastr.options = {
        "closeButton": closeButton,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr.warning(message, title);
    }
  }
});

export const error = new ValidatedMethod({
  name: 'notifications.error',
  validate: new SimpleSchema({
    closeButton: {
      type: Boolean,
      optional: true
    },
    timeOut: {
      type: Number,
      optional: true
    },
    title: {
      type: String,
      optional: true
    },
    message: {
      type: String
    }
  }).validator(),
  run({closeButton, timeOut, title, message}) {
    if (this.isSimulation) {
      toastr.options = {
        "closeButton": closeButton,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr.error(message, title);
    }
  }
});
