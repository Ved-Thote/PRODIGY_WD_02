class Stopwatch {
  constructor() {
    this.time = 0;
    this.interval = null;
    this.running = false;
    this.lapCounter = 0;
    this.laps = [];
    this.isPaused = false;

    this.display = document.getElementById("display");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.lapBtn = document.getElementById("lapBtn");
    this.lapTimes = document.getElementById("lapTimes");

    this.bindEvents();
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.pauseBtn.addEventListener("click", () => this.pause());
    this.resetBtn.addEventListener("click", () => this.reset());
    this.lapBtn.addEventListener("click", () => this.lap());
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.isPaused = false;
      this.display.classList.add("running");
      this.interval = setInterval(() => {
        this.time += 10;
        this.updateDisplay();
      }, 10);

      this.startBtn.disabled = true;
      this.pauseBtn.disabled = false;
      this.lapBtn.disabled = false;
      this.resetBtn.disabled = true;
    }
  }

  pause() {
    if (this.running) {
      this.running = false;
      this.isPaused = true;
      this.display.classList.remove("running");
      clearInterval(this.interval);

      this.startBtn.disabled = false;
      this.startBtn.textContent = "Resume";
      this.pauseBtn.disabled = true;
      this.lapBtn.disabled = true;
      this.resetBtn.disabled = false;
    }
  }

  reset() {
    this.running = false;
    this.isPaused = false;
    this.display.classList.remove("running");
    clearInterval(this.interval);
    this.time = 0;
    this.lapCounter = 0;
    this.laps = [];

    this.updateDisplay();
    this.updateLapDisplay();

    this.startBtn.disabled = false;
    this.startBtn.textContent = "Start";
    this.pauseBtn.disabled = true;
    this.lapBtn.disabled = true;
    this.resetBtn.disabled = false;
  }

  lap() {
    if (this.running) {
      this.lapCounter++;
      const lapTime = this.time;
      this.laps.unshift({
        number: this.lapCounter,
        time: lapTime,
        formattedTime: this.formatTime(lapTime),
      });
      this.updateLapDisplay();
    }
  }

  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`;
  }

  updateDisplay() {
    this.display.textContent = this.formatTime(this.time);
  }

  updateLapDisplay() {
    if (this.laps.length === 0) {
      this.lapTimes.innerHTML = "";
      return;
    }

    const lapHTML = this.laps
      .map(
        (lap) => `
                    <div class="lap-item">
                        <span class="lap-number">Lap ${lap.number}</span>
                        <span class="lap-time">${lap.formattedTime}</span>
                    </div>
                `
      )
      .join("");

    this.lapTimes.innerHTML = `
                    <h3>Lap Times</h3>
                    ${lapHTML}
                `;
  }
}

// Initialize the stopwatch when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Stopwatch();
});
