export const validate = (data, type = "register") => {
  const { username, email, password, confirmPassword } = data;
  let errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+$/i.test(email)) {
    errors.email = "Invalid email format!";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Minimum 6 characters!";
  }

  if (type === "register") {
    if (!username) {
      errors.username = "Name is required!";
    }

    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password =
        "Passowrd must contain at least 1 capital letter and 1 number!";
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match!";
    }
  }

  return errors;
};
