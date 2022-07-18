function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", loginUser)
    createAccountForm.addEventListener("submit", registerUser)
    async function loginUser(e) {
        e.preventDefault();

        // Perform your AJAX/Fetch login
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
            //pass username password to backend
        const result = await fetch('http://localhost:9999/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password

                })
            }).then((res) => res.json()).catch(err => { console.log("error:" + err) })
            // console.log("HIII", result)
        if (result.status === "success") {
            localStorage.setItem('token', result.data) //jwt token stored for authentication of user
            localStorage.setItem('email', username) //can be username or email ...incomplete
            setFormMessage(loginForm, "success", window.location.href = "../../index.html")


        } else {

            setFormMessage(loginForm, "error", "Invalid username/password combination");
        }
    };
    async function registerUser(e) {
        e.preventDefault();

        // Perform your AJAX/Fetch login
        const username = document.getElementById('newusername').value
        const password = document.getElementById('newpassword').value
        const email = document.getElementById('email').value
        const confirmpassword = document.getElementById('confirmpassword').value
        if (password !== confirmpassword) {
            setFormMessage(createAccountForm, "error", "Passwords are not same")
            return
        }
        const result = await fetch('http://localhost:9999/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                username,
                password

            })
        }).then((res) => res.json()).catch(err => { console.log(err) })
        if (result.status === 'Saved') {
            //everything went fine
            setFormMessage(createAccountForm, "success", "Account successfully created")
        } else {
            setFormMessage(createAccountForm, "error", result.error)
        }
    };

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});