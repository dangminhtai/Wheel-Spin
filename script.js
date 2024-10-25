const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Hàm tạo vòng quay với các nhãn tùy chỉnh
function createWheel(labels) {
  const totalDegrees = 360;
  const numberOfLabels = labels.length;
  const degreePerLabel = totalDegrees / numberOfLabels;

  const rotationValues = [];

  // Cập nhật góc min/max cho mỗi nhãn
  for (let i = 0; i < numberOfLabels; i++) {
    const maxDegree = 90 - i * degreePerLabel;
    const minDegree = maxDegree - degreePerLabel;
    rotationValues.push({
      minDegree: (minDegree + 360) % 360,
      maxDegree: (maxDegree + 360) % 360,
      label: labels[i],
    });
  }

  // Kích thước của mỗi phần
  const data = Array(numberOfLabels).fill(16);

  // Màu nền xen kẽ cho các phần
  const pieColors = ["#3369E8", "#009925", "#EEB211", "#D50F25"];
  const backgroundColors = Array(numberOfLabels).fill(0).map((_, i) => pieColors[i % pieColors.length]);

  // Tạo biểu đồ
  let myChart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: labels.map(label => label.length > 10 ? label.slice(0, 10) + "..." : label), // Rút gọn nhãn dài
      datasets: [
        {
          backgroundColor: backgroundColors,
          data: data,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 0 },
      plugins: {
        tooltip: false,
        legend: { display: false },
        datalabels: {
          color: "#ffffff",
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            return label;
          },
          font: {
            size: 18,
          },
        },
      },
    },
  });

  // Hiển thị nhãn dựa trên góc random
  const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (
        (angleValue >= i.minDegree && angleValue < i.maxDegree) ||
        (i.minDegree > i.maxDegree && (angleValue >= i.minDegree || angleValue < i.maxDegree))
      ) {
        finalValue.innerHTML = `<p>Bạn đã quay vào ô : ${i.label}</p>`;
        spinBtn.disabled = false;
        break;
      }
    }
  };

  // Đếm số lần quay và điều khiển quay
  let count = 0;
  let resultValue = 101;

  spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>Chúc bạn may mắn!</p>`;
    let randomDegree = Math.floor(Math.random() * 360);
    let rotationInterval = window.setInterval(() => {
      myChart.options.rotation = (myChart.options.rotation || 0) + resultValue;
      myChart.update();
      if (myChart.options.rotation >= 360) {
        count += 1;
        resultValue -= 5;
        myChart.options.rotation = 0;
      } else if (count > 15 && Math.round(myChart.options.rotation) % 360 === randomDegree) {
        valueGenerator(randomDegree);
        clearInterval(rotationInterval);
        count = 0;
        resultValue = 101;
      }
    }, 10);
  });
}

// Lấy số lượng nhãn và nội dung nhãn từ người dùng
const numLabels = parseInt(prompt("Nhập số lượng nhãn:"));
const labels = [];
for (let i = 0; i < numLabels; i++) {
  labels.push(prompt(`Nhập văn bản cho nhãn ${i + 1}:`));
}

// Tạo vòng quay với nhãn người dùng nhập
createWheel(labels);
