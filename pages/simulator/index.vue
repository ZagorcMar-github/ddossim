<template>
  <v-overlay
    attach="html"
    scrim="overlayTheme"
    class="d-flex justify-center align-center"
    v-model="overlay"
    scroll-strategy="block"
  >
    <div v-if="overlayOver" class="custom_heading text-red-lighten-1 text-h1">
      WASTED
    </div>
    <div v-else class="custom_heading text-green-lighten-1 text-h1">
      WINNER WINNER
    </div>
  </v-overlay>

  <v-container>
    <div>
      <v-row class="">
        <v-col cols="12" lg="6" align="center">
          <LineChart
            :scale-min="0"
            :scale-max="300"
            :chartData="chartData"
            y-unit="packets/s"
            chart-title="Network traffic"
          />
        </v-col>
        <v-col cols="12" lg="6" align="center">
          <LineChart
            :chartData="chartDataCPU"
            y-unit="%"
            chart-title="CPU usage"
            :scale-min="0"
            :scale-max="100"
        /></v-col>
        <v-col>
          <LineChart
            :chartData="chartDataRAM"
            y-unit="%"
            chart-title="RAM usage"
            :scale-min="0"
            :scale-max="100"
        /></v-col>

        <v-col cols="12" align="center">
          <packets
            ref="packetCreation"
            :triggerAttack="ddosFlag"
            :number-of-packets="packetCount"
            :quiz-answers="quizAnswers"
            @fillQuestionnaire="fillQuestionnaire"
          />
        </v-col>
      </v-row>

      <v-btn
        :disabled="startSimToggle"
        color="primary"
        elevation="24"
        :prepend-icon="startStop ? 'mdi-server-off' : 'mdi-server'"
        position="fixed"
        class="foo mb-4 mr-8"
        size="large"
        min-width="205"
        @click="toggleStartStopSim"
      >
        <span v-if="!startStop">start </span><span v-else>stop</span>
        <span>simulation</span>
      </v-btn>

      <v-btn
        v-if="startTimer"
        @mouseover="snackbar = true"
        position="fixed"
        class="gameOverlay d-flex justify-center mb-16 mr-8"
        @click="quizDialog = true"
        >questions 3
        <v-tooltip activator="parent" location="top"
          >Abnormal behavior detected <br />
          when Ram usage reaches 100% the server will crash ... You have aprox 2
          minutes
        </v-tooltip></v-btn
      >
      <quiz
        :quiz-dialog="quizDialog"
        @showQuizDialog="closeQuizDialog"
        :quiz-answers="quizAnswers"
        @showDeathScreen="stopGame"
        @showSuccesScreen=""
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">


const store = useLoginStore();

definePageMeta({
  middleware: ["auth"],
});

interface quizAnswers {
  ddosOrDos: boolean;
  AttackerSrc: string;
  attackType: number;
}
interface ChartContent {
  labels: string[]; // Specify the type for the 'labels' array
  datasets: {
    borderColor: string;
    data: number[]; // Specify the type for the 'data' array
    resets: boolean;
  }[];
}
import { useLoginStore } from "#imports";
import { ref, onMounted } from "vue";
import quiz from "~/components/quiz.vue";
import packets from "~/components/packets.vue";
import LineChart from "../components/lineChart.vue";
import { useDisplay } from "vuetify";
import axios from "axios";

const name = "App";
const packetCreation = ref<InstanceType<typeof packets> | null>(null);
const startSimToggle = ref(false);
const currentDate = ref(new Date());
const quizAnswers = ref({} as quizAnswers);
const quizDialog = ref(false);
const ddosFlag = ref(false);
const delayHelper = ref(false);
const overlay = ref(false);
const overlayOver = ref(false);
const failedAtempts = ref(0);
const succesAtempts = ref(0);
const minutes = ref(2);
const seconds = ref(0);
const startTime = ref(new Date());
const endTime = ref(new Date());
const snackbar = ref(false);
const packetCount = ref(0);
const startTimer = ref(false);
const attackTrigger = ref(false);
const startStop = ref(false);
const chartDataRAM = ref<ChartContent>({
  labels: [],
  datasets: [
    {
      borderColor: "#5C6CFA",
      data: [],
      resets: true,
    },
  ],
});
const chartData = ref<ChartContent>({
  labels: [],
  datasets: [
    {
      borderColor: "#5C6CFA",
      data: [],
      resets: true,
    },
  ],
});
const chartDataCPU = ref<ChartContent>({
  labels: [],
  datasets: [
    {
      borderColor: "#5C6CFA",
      data: [],
      resets: true,
    },
  ],
});

/*500 --->30%
      1   ---> 0.17*/

function fillQuestionnaire(payload: quizAnswers) {
  quizAnswers.value.AttackerSrc = payload.AttackerSrc;
  quizAnswers.value.attackType = payload.attackType;
  quizAnswers.value.ddosOrDos = payload.ddosOrDos;
}
function closeQuizDialog(value: boolean) {
  quizDialog.value = value;
}
function addnewDataEntry(
  existingChartData: ChartContent,
  dataEntry: number,
  label: Date
) {
  existingChartData.datasets[0].data.push(dataEntry);
  existingChartData.labels.push(
    `${label.getHours()}.${label.getMinutes()}.${label.getSeconds()}`
  );
}
function calculateTimeTaken(dateEnd: Date, DateStart: Date): number {
  const minutes = 1000; //format ms to m
  let timeDif: number;
  timeDif = (dateEnd.getTime() - DateStart.getTime()) / minutes;
  return timeDif;
}
async function sendAtempt(atemptStatus: number, timeTaken: number = 1) {
  const currentDAteISO = currentDate.value.toISOString().split("T")[0];
  console.log(
    "userId: " +
      store.userId+
    "curentDate: " +
      currentDAteISO +
      " attempt status: " +
      atemptStatus +
      " time Taken: " +
      timeTaken
  );

  try {
    let userId = store.userId;
    let DateTimeOfAtempt = new Date();
    const data = {
      UserId: userId,
      timeTaken: timeTaken,
      FailedAtempt: atemptStatus,
      DateTimeOfAtempt: DateTimeOfAtempt,
    };
    await axios.post("/api/api/score/insertScore", data);
  } catch (error) {}
}
function sendSuccesAtempt(timeTaken?: number) {
  sendAtempt(0, timeTaken);
}
function sendFailedAtempt(timeTaken?: number) {
  sendAtempt(1, timeTaken);
}
function stopGame(payload: boolean) {
 
  startSimToggle.value = false;
  endTime.value = new Date();
    let timeTaken = Math.floor(calculateTimeTaken(endTime.value, startTime.value));
  if (!payload) {
    
    sendSuccesAtempt(timeTaken);
  } else {
    sendFailedAtempt(timeTaken);
  }
  console.log(payload);
  closeQuizDialog(false);
  overlay.value = true; //game over screen
  overlayOver.value = payload;
  ddosFlag.value = false;
  //wy wu wy wu !!!!!! WI WU WI WU
  packetCreation.value?.togglePacketCreation();
  // Toggle the startStop flag on packet creation
  startStop.value = false;
  startTimer.value = false;
  delayHelper.value = true;
}

async function addData() {
  let attackTrigger = Math.floor(Math.random() * 10) + 10;
  let i = 0;
  let ramUsage = 0;
  let cpuUsage = 0;
  let timer = 100;
  let maxRam = 100;
  let difTo100 = 0;
  let lastTicksRamUsage: number;
  let timerwithFlux = 100;
  lastTicksRamUsage = 0;
  while (startStop.value) {
    if (Math.floor(ramUsage) === 100 && lastTicksRamUsage === 100) {
      stopGame(true);
      break;
    }

    const now: Date = new Date();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 0.5 seconds js be v primeru ko nimamo async metod in dodamo set time out v bistvu sprožu celotno for loop ustvarul 100 instanca timeouta in nato vse sprožu zato dodamo ta promise
    const newChartData = JSON.parse(JSON.stringify(chartData.value));
    const newChartDataCPU = JSON.parse(JSON.stringify(chartDataCPU.value));
    const newChartDataRAM = JSON.parse(JSON.stringify(chartDataRAM.value));

    let networkTrafick = Math.random() * 100 + 100;

    packetCount.value = networkTrafick;

    if (ddosFlag.value) {
      timer += difTo100;
      timerwithFlux = timer + Math.floor(Math.random() * 20) - 10;

      networkTrafick += 10000;
      if (!delayHelper.value) {
        startTimer.value = i > attackTrigger;
      }
      delayHelper.value = false;
    }
    if (i === attackTrigger) {
      startTime.value = new Date();
      ddosFlag.value = true;
    }

    //calculate time left and make a hp bar with ram usage graph
    cpuUsage = networkTrafick * (30 / 500);
    if (i === attackTrigger) {
      timer = cpuUsage;
      difTo100 = (maxRam - cpuUsage) / (minutes.value * 60 + seconds.value);
    }
    ramUsage = Math.min(cpuUsage, timerwithFlux);
    ramUsage = Math.min(ramUsage, 100);

    cpuUsage = Math.min(cpuUsage, 100);
    addnewDataEntry(newChartData, networkTrafick, now);
    addnewDataEntry(newChartDataCPU, cpuUsage, now);
    addnewDataEntry(newChartDataRAM, ramUsage, now);
    //pregledujemo le zadnjo minuto aktivnosti
    let lengthOF = newChartData.labels.length;
    if (lengthOF > 50) {
      newChartData.labels.shift();
      newChartData.datasets[0].data.shift();
    }

    chartDataCPU.value = newChartDataCPU;
    chartData.value = newChartData;
    chartDataRAM.value = newChartDataRAM;
    i++;

    lastTicksRamUsage = Math.floor(ramUsage);
  }
}
function toggleStartStopSim(): void {
  startStop.value = !startStop.value;
  startSimToggle.value = !startSimToggle.value;

  ddosFlag.value = false;

  packetCreation.value?.togglePacketCreation(); // packetCreation.value.togglePacketCreation() // Toggle the startStop flag !!!!!!!!!!!!!!!!!
  if (startStop.value) {
    addData(); // Restart the loop if it's set to start
  }
  if (startTimer) {
    startTimer.value = false;
    delayHelper.value = true;
  }
  console.log("delay " + delayHelper.value);
}
function handleBeforeUnload(event: any) {
  event.preventDefault();
  if (ddosFlag.value) {
    sendFailedAtempt();
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  addData();
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
onUnmounted(() => {
  if (ddosFlag.value) {
    sendFailedAtempt();
  }
});
</script>
<style lang="scss" scoped>
.contain {
  height: 100%;
}
.gameOverlay {
  max-width: 290px;
  border-radius: 5px;
  padding: 1%;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.foo {
  bottom: 0;
  right: 0;
}

.custom_heading {
  font-size: 155px !important;
  position: absolute;
  line-height: 0.8;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px;

  font-family: "SDGlitchRobotDemo" !important;
}
</style>
