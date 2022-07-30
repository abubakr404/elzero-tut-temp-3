let progresses = document.querySelectorAll(".skills-box span.prog"),
  loader = document.querySelector(".loader"),
  skills = document.querySelector("#Skills"),
  stats = document.querySelector("#Stats"),
  counts = document.querySelectorAll(".stat span.number");
function counter(el) {
  let goal = el.dataset.goal;
  let counters = setInterval(() => {
    if (+el.innerText < goal) {
      el.innerText++;
    } else {
      clearInterval(counters);
    }
  }, 3000 / goal);
}
window.onload = function () {
  loader.style = `opacity: 0; width: 0%; height: 0%;`;
};
window.onscroll = function () {
  if (window.scrollY >= skills.offsetTop) {
    progresses.forEach((progress) => {
      progress.style = `--width: ${progress.dataset.width}%;`;
    });
  }
  if (window.scrollY >= stats.offsetTop) {
    counts.forEach((count) => counter(count));
  }
};
