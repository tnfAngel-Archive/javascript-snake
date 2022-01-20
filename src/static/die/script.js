function play() {
    window.location.href = '/play';
}

document.getElementById('ns').innerHTML = 'You loose';
document.getElementById('score').innerHTML = localStorage.getItem('points') || '0';
document.getElementById('best_score').innerHTML = localStorage.getItem('score') || '0';