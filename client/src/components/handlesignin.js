import signinStyle from './signin.module.css'
function handlesignin(){
    const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () =>
container.classList.add(signinStyle['right-panel-active']));

signInButton.addEventListener('click', () =>
container.classList.remove(signinStyle['right-panel-active']));

}

export default handlesignin


