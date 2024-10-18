<template>
  <v-card class="px-2" position="relative" height="40vh">
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
  </v-card>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    chartData: Object,
    scaleMin: Number,
    scaleMax: Number,
    yUnit: String,
    chartTitle: String,
  },

  name: "LineChart",
  components: { Line },
  data() {
    return {
      mydata: "",
      chartOptions: {
        plugins: {
          title: {
            display: true,
            text: this.chartTitle,
            color: "white", // Set the title text color
          },
        },
        animation: {
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "time",
              color: "white", // Set the title text color
            },

            ticks: {
              color: "white", // Set the text color for x-axis labels
            },
          },
          y: {
            title: {
              display: true,
              text: this.yUnit,
              color: "white", // Set the title text color
            },
            suggestedMin: this.scaleMin,
            suggestedMax: this.scaleMax,
            ticks: {
              color: "white", // Set the text color for y-axis labels
            },
          },
        },

        maintainAspectRatio: false,
      },
    };
  },
  methods: {},
  created() {
    //this.addData();
  },
};
</script>
