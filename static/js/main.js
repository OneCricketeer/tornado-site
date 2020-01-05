function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

jQuery.postJSON = function(url, args, callback) {
    args._xsrf = getCookie("_xsrf");
    $.ajax({url: url, data: $.param(args), dataType: "text", type: "POST",
        success: function(response) {
        callback(eval("(" + response + ")"));
    }});
};

ajax_login = function(email, pass, success_callback, error_callback, fail_callback) {
  var params = {email: email, p: pass};

  var failhandle = function(jqxhr, textStatus, error) {
      console.log("Login POST failed with " + textStatus + " and error " + error);
      // TODO: Error handling
      if (fail_callback && typeof(fail_callback) === "function") {
        fail_callback();
      }
  };

  $.post("/login", params)
    .done(function(data, textStatus, jqxhr) {
      if (!data || data == "") {
        failhandle(jqxhr, textStatus);
        return;
      }
      try {
        data = JSON.parse(data);
      } catch(e) {
        failhandle(jqxhr, e);
        return;
      }

      console.log("AJAX done. Returned with data: \"" + JSON.stringify(data) + "\"");
      if (data.status == "Success") {
        console.log("Register success. Response message: \"" + data.message + "\"");
        if (success_callback && typeof(success_callback) === "function") {
          success_callback();
        }
      } else if (data.status == "Error") {
        console.log("Register failed. Response message \"" + data.message + "\"");
        // TODO: Error handling
        if (error_callback && typeof(error_callback) === "function") {
          error_callback(data);
        }
      }
    }).fail(failhandle);
};

ajax_register = function(username, email, pass, success_callback, error_callback, fail_callback) {
  var params = {username: username, email: email, p: pass};

  var failhandle = function(jqxhr, textStatus, error) {
      console.log("Register POST failed with " + textStatus + " and error " + error);
      // TODO: Error handling
      if (fail_callback && typeof(fail_callback) === "function") {
        fail_callback();
      }
  };

  $.post("/register", params)
    .done(function(data, textStatus, jqxhr) {
      if (!data || data == "") {
        failhandle(jqxhr, textStatus);
        return;
      }
      try {
        data = JSON.parse(data);
      } catch(e) {
        failhandle(jqxhr, e);
        return;
      }

      if (data.status == "Success") {
        console.log("Login success. Response message: " + data.message);
        if (success_callback && typeof(success_callback) === "function") {
          success_callback();
        }
      } else if (data.status == "Error") {
        console.log("Login failed with message " + data.message);
        // TODO: Error handling
        if (error_callback && typeof(error_callback) === "function") {
          error_callback(data);
        }
      }
    }).fail(failhandle);
};

loginClearError = function() {
  var $errorAlert = $("#login-panel #login-error-alert");
  var $err = $("#login-panel #login-error-msg");
  $errorAlert.addClass("hidden");
  $err.html('');
};

loginShowError = function(msg, strong_error) {
  strong_error = (typeof(strong_error) === "undefined") ? false : strong_error;
  var $errorAlert = $("#login-panel #login-error-alert");
  var $err = $("#login-panel #login-error-msg");
  $errorAlert.removeClass("hidden");
  var txt = msg;
  if (strong_error) {
    txt = '<strong>Error</strong> ' + txt;
  }
  $err.html(txt);
};

login_action = function(email, password) {
  ajax_login(email, password,
    function() {
      console.log("Login form submit: success");
      window.location.href = "index.php";
    },
    function(data) {
      console.log("Login form submit: error");
      login_error_handle(data);
    },
    function() {
      console.log("Login form submit: failure");
      loginShowError("Error Logging In!");
    });
};

login_error_handle = function(data) {
  if (data && data != "" && data.status == "Error") {
    loginShowError(data.message, true);
  } else {
    loginShowError("Error Logging In!");
  }
};

setupLoginForm = function() {
  loginClearError();
    $("#login_form #login_btn").click(function(e) {
      loginClearError();

      var email = $("#login_form input[name='email']").val();
      var $pass = $("#login_form input[name='password']");
      var p = hex_sha512($pass.val());

      $pass.val("");

      login_action(email, p);
    });

    $("#login_form input[name='password']").keyup(function(event) {
      if (event.which == 13 || event.keyCode == 13) {
        $("#login_form #login_btn").click();
      }
    });
};

register_action = function(username, email, password) {
  ajax_register(username, email, password,
    function() {
      console.log("Register form submit: success");

      swal({
          title: "Registration Successful!",
          text: "Returning you to the login page!",
          type: "success",
          allowOutsideClick: true
        },
        function() {
          window.location.href = "login.php";
        }
      );
    },
    function(data) {
      console.log("Register form submit: error");
      register_error_handle(data);
    },
    function() {
      console.log("Register form submit: failure");
      registerShowError("Error in registration!");
    });
};

register_error_handle = function(data) {
  var $username = $("#reg_form input[name='username']");
  var $email = $("#reg_form input[name='email']");

  if (data && data != "" && data.status == "Error") {
    registerShowError(data.message, true);
    if (data.code == "UsernameExists") {
      $username.focus();
    } else if (data.code == "EmailExists" || data.code == "InvalidEmail") {
      $email.focus();
    }
  } else {
    registerShowError("Error in registration!");
  }
};

registerClearError = function() {
  var $errorAlert = $("#reg-panel #register-error-alert");
  var $err = $("#reg-panel #register-error-msg");
  $errorAlert.addClass("hidden");
  $err.html('');
};

registerShowError = function(msg, strong_error) {
  strong_error = (typeof(strong_error) === "undefined") ? false : strong_error;
  var $errorAlert = $("#reg-panel #register-error-alert");
  var $err = $("#reg-panel #register-error-msg");
  $errorAlert.removeClass("hidden");
  var txt = msg;
  if (strong_error) {
    txt = '<strong>Error</strong> ' + txt;
  }
  $err.html(txt);
};

setupRegistrationForm = function() {
  registerClearError();

  $("#reg_form #reg_btn").click(function(e) {
    registerClearError();
    var $username = $("#reg_form input[name='username']");
    var $email = $("#reg_form input[name='email']");
    var $pass = $("#reg_form input[name='password']");
    var $confpass = $("#reg_form input[name='confirmpwd']");

    if ($username.val() == '' ||
      $email.val() == '' ||
      $pass.val() == '' ||
      $confpass.val() == '') {
        registerShowError('You must provide all the requested details. Please try again.');
        return false;
    }

    // Check the username
    var re = /^\w+$/;
    if (!re.test($username.val())) {
      registerShowError("Username must contain only letters, numbers, and underscores. Please try again.");
      $username.focus();
      return false;
    }

    // Could check the email validity also but the POST handles that

    // Check that the password is sufficently long (min 6 chars)
    if ($pass.val().length < 6) {
      registerShowError('Passwords must be at least 6 characters long.  Please try again.');
      $pass.focus();
      return false;
    }

    // At least one number, one lowercase and one uppercase letter
    // At least six characters
    re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!re.test($pass.val())) {
      registerShowError('Passwords must contain at least one number, one lowercase, and one uppercase letter. Please try again.');
      $pass.focus();
      return false;
    }

    if ($pass.val() != $confpass.val()) {
      registerShowError('Your password and confirmation do not match. Please try again.');
      $pass.focus();
      $confpass.val("");
      return false;
    }

    var p = hex_sha512($pass.val());

    $pass.val("");
    $confpass.val("");

    // Continue with register
    register_action($username.val(), $email.val(), p);
  });

  $("#reg_form input[name='confirmpwd']").keyup(function(event) {
    if (event.which == 13 || event.keyCode == 13) {
      $("#reg_form #reg_btn").click();
    }
  });

  $("#reg_form input[name='username']").keyup(function(event) {
    var min_username_length = 6;
    var re = /^\w+$/;

    //removes spaces from username
		$(this).val($(this).val().replace(/\s/g, ''));
		var username = $(this).val();

    var $inputGroup = $("#reg_form #username-group");
    var clearFeedback = function() {
      // $("#reg_form #user-result").html('');
      $inputGroup.removeClass("has-success has-error");
      $inputGroup.find("#username-feedback-icon").removeClass("glyphicon-ok glyphicon-remove");
      $inputGroup.find("#usernameInputFeedback").html("");
    };
    var addErrorFeedback = function() {
      // $("#reg_form #user-result").html('<img src="imgs/not-available.png" />');
      $inputGroup.addClass("has-error");
      $inputGroup.find("#username-feedback-icon").addClass("glyphicon-remove");
      $inputGroup.find("#usernameInputFeedback").html("(error)");
    };
    var addSuccessFeedback = function() {
      // $("#reg_form #user-result").html('<img src="imgs/available.png" />');
      $inputGroup.addClass("has-success");
      $inputGroup.find("#username-feedback-icon").addClass("glyphicon-ok");
      $inputGroup.find("#usernameInputFeedback").html("(success)");
    };

	if(username.length < min_username_length){
      clearFeedback();
      return;
    }


	if(username.length >= min_username_length) {
      clearFeedback();
      if (!re.test(username)) {
        addErrorFeedback();
        return;
      }
			// $("#reg_form #user-result").html('<img src="imgs/ajax-loader.gif" />');
      var params =  {username:username};

	  $.post('/api/usernameExists',params)
        .done(function(data) {
          if (!data || data == "") {
            addErrorFeedback();
            return;
          }
          try {
            data = JSON.parse(data);
          } catch(e) {
            addErrorFeedback();
            return;
          }

          if (data.status == "Success") {
            addSuccessFeedback();
          } else if (data.status == "Error") {
            addErrorFeedback();
          }
        })
      .fail(addErrorFeedback);

    } // if username meets length
  }); // username realtime check
}; // setupRegistrationForm

/** main **/
$(document).ready(function() {
  console.log("ready!");

  setupLoginForm();
  setupRegistrationForm();
});
