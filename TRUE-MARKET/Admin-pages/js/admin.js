/* ─── Sidebar Toggle ─── */
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const hamburger = document.getElementById("hamburger");
const isMobile = () => window.innerWidth <= 768;

function toggleSidebar() {
  if (isMobile()) {
    sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("show");
  } else {
    sidebar.classList.toggle("collapsed");
    hamburger.classList.toggle("active-btn");
  }
}
function closeSidebar() {
  sidebar.classList.remove("mobile-open");
  overlay.classList.remove("show");
}
window.addEventListener("resize", () => {
  if (!isMobile()) {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("show");
  }
});

/* ─── Bar Chart ─── */
const ctx = document.getElementById("incomeChart");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
    ],
    datasets: [
      {
        label: "Profit",
        data: [15, 25, 20, 40, 10, 10, 45, 0, 35, 0],
        backgroundColor: "#28A745",
        borderRadius: 4,
        stack: "stack1",
      },
      {
        label: "Loss",
        data: [20, 30, 35, 15, 25, 25, 40, 30, 25, 35],
        backgroundColor: "#1E3A8A4D",
        borderRadius: 4,
        stack: "stack1",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        display: false,
        grid: {
          display: false,
        },
      },
    },
  },
});

/* ─── Donut Chart ─── */
const dCtx = document.getElementById("donutChart").getContext("2d");
new Chart(dCtx, {
  type: "doughnut",
  data: {
    labels: ["Current", "New", "Canceled"],
    datasets: [
      {
        data: [62, 28, 10],
        backgroundColor: ["#22c55e", "#f97316", "#1e40af"],
        borderWidth: 3,
        borderColor: "#ffffff",
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#111827",
        bodyColor: "#6b7280",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => " " + ctx.parsed + "%",
        },
      },
    },
  },
});
