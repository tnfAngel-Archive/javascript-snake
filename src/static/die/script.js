function play() {
    window.location.href = '/play';
}

function getParameterByName(name) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


document.getElementById('ns').innerHTML = getParameterByName('ns') === 'true' ? 'New score!' : 'You loose';
document.getElementById('score').innerHTML = localStorage.getItem('points') || '0';
document.getElementById('best_score').innerHTML = localStorage.getItem('score') || '0';