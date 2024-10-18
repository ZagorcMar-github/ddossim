<template>
  <div class="">
    <div>
      <v-parallax src="../assets/city.png" class="">
        <v-row>
          <v-col>
            <v-card
              v-if="ActiveSession"
              class="transparency mt-6 mx-2"
              max-width="460"
              ><div class="text-h5 mb-3">Past atempts</div>
              <ul>
                <li v-for="n,index in userScore" :key="index" >
                  <div v-text="`taken at: ${n.DateTimeOfAtempt} | time taken: ${n.TimeTaken} | failed: ${n.failedAtempt}`">
                    
                  </div>
                </li>
              </ul>
            </v-card>
          </v-col>
          <v-menu transition="scroll-y-transition">
            <template v-slot:activator="{ props }">
              <div class="d-flex justify-end">
                <v-btn
                  prepend-icon="mdi-scoreboard-outline"
                  class="transparency ma-2 mt-8 text-h5"
                  v-bind="props"
                >
                  Top score
                </v-btn>
              </div>
            </template>
            <v-list>
              <v-list-item v-for="n,index in best5scoreboard" :key="index" link>
                <v-tooltip activator="parent" location="start"
                  >date:{{ Date() }}</v-tooltip
                >
                <v-list-item-title
                  v-text="`${n.Country} | user: ${n.Username} | time: ${n.TimeTaken}`"
                ></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        <div class="custom_heading text-h3 text-sm-h1">
          WELCOME TO BYTE CITY
        </div>
      </v-parallax>
    </div>
    <v-row class="mt-2 mb-0 mx-1" align-content="center">
      <v-col align="center" cols="12" class="text-h2 mt-10"
        >To fight the abyss one must know it</v-col
      >
      <v-col align="center" cols="12" class="text-h2 mb-10">
        <div width="100" height="100px" class="backdrop"></div>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card
          min-height="600"
          class="d-flex flex-column justify-center align-center"
        >
          <div class="text-h6 px-2 py-2">
            Distributed Denial of Service (DDoS) attacks are digital storms that
            can disrupt online services by overwhelming them with an excessive
            amount of traffic. To defend against this virtual onslaught, it's
            crucial to understand the basics of DDoS attacks and how to mitigate
            their impact. What is a DDoS Attack? A DDoS attack occurs when
            multiple compromised devices flood a target system with traffic,
            causing it to become slow, unresponsive, or even unavailable.
            <br /><br />
            Types of DDoS Attacks:
            <ul>
              <li>- Volumetric Attacks: Overwhelm network bandwidth.</li>
              <li>- TCP/UDP Exhaustion: Deplete server resources.</li>
              <li>
                - Application Layer Attacks: Target specific applications or
                services.
              </li>
            </ul>
            <br />
            How to Mitigate DDoS Attacks:

            <ul>
              <li>
                - Firewalls and Intrusion Prevention Systems: Filter malicious
                traffic.
              </li>

              <li>
                - Content Delivery Networks (CDNs): Distribute traffic across
                multiple servers.
              </li>
              <li>
                - Anomaly Detection Systems: Identify unusual patterns and
                trigger protective measures.
              </li>
            </ul>
            <br /></div
        ></v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/0I4O4hoKzb8?si=SGCw0M5ZxkRV_zvs"
          title="YouTube video player"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </v-col>
      <v-col align="center" cols="12" class="text-h2 mt-10">Deep dive</v-col>
      <v-col align="center" cols="12" class="text-h2 mb-10">
        <div width="100" height="100px" class="backdrop"></div>
      </v-col>
    </v-row>
    <v-row
      class="d-flex flex-wrap-reverse mt-2 mb-0 mx-1"
      align-content="center"
    >
      <v-col cols="12" lg="6">
        <v-card height="600">
          <v-row>
            <v-col cols="6">
              <iframe
                width="100%"
                height="280"
                src="https://www.youtube.com/embed/W1_tJvgbEog?si=1KPfvq2CMYFZ-wzv"
                title="YouTube video player"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </v-col>
            <v-col cols="6">
              <iframe
                width="100%"
                height="280"
                src="https://www.youtube.com/embed/-FPawMupsKY?si=mP3f2zQVN_kJZsua"
                title="YouTube video player"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </v-col>
            <v-col cols="6">
              <iframe
                width="100%"
                height="280"
                src="https://www.youtube.com/embed/BzgsT-_GC4Q?si=TDtiG4qTyGBbWZdz"
                title="YouTube video player"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </v-col>
            <v-col cols="6">
              <iframe
                width="100%"
                height="280"
                src="https://www.youtube.com/embed/VPcYMgTYQs0?si=zDrWiZxA-iPfu8Ul"
                title="YouTube video player"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card width="100%" height="600" class="text-h2 px-2 py-2"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed dolor
          assumenda in non, dolores nam, nulla esse eligendi id est enim
          corrupti porro repellat, architecto excepturi velit tempore
          dignissimos nemo!</v-card
        >
      </v-col>
    </v-row>

    <!--<v-img
        src="../assets/city.png"
        class="background-image-img"
        aspect-ratio="16:9"
        max-height="1920px"
      ></v-img>-->
  </div>
</template>

<script lang="ts">
  interface scoreBoard {
    Username: string;
    Country: string;
    TimeTaken: number;
  }
  interface userScore {
    DateTimeOfAtempt: Date;
    TimeTaken: number;
    failedAtempt: number;
  }
import { useLoginStore } from "#imports";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      overlay: false,
      scoreExists: true,
      best5scoreboard: [] as  scoreBoard[],
      userScore: [] as userScore[],
    };
  } /*500 --->30%
    1   ---> 0.17*/,
  methods: {
    showStore() {
      let store = useLoginStore();
      console.log(
        `userID: ${store.userId} \nusername: ${store.username}\ncountry: ${store.country}`
      );
    },
    async fetchScoreBoard() {
      try {
        let response = await axios.get("api/api/score/getBestScore")
        console.log(response.data);
        this.best5scoreboard=response.data;

      } catch (error) {
        console.error("error fetching scoreboard")
      }
    },
    
    async fetchUserScore() {
      let store= useLoginStore();
      let userId = store.userId;
      if(this.ActiveSession){
      try {

        let response = await axios.get("api/api/score/getPastResults?id=" + userId);
        console.log(response.data)
        this.userScore=response.data;
      } catch (error) {
        console.error(error)
      }}
    }
  },
  mounted() {
    this.fetchScoreBoard();
    this.fetchUserScore();
  },
  computed: {
    ActiveSession() {
      let store = useLoginStore();
      let activeSession = store.ActiveSession; // Correctly declare the variable
      return activeSession;
    },
  },
};
</script>
<style lang="scss" scoped>
.cyber {
  font-family: "SDGlitchRobotDemo" !important;
}
.transparency {
  background-color: rgb(0, 0, 0, 0);
}
.custom_heading {
  position: absolute;
  line-height: 0.8;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px;
  color: white;
  font-family: "SDGlitchRobotDemo" !important;
}
.backdrop {
  background-image: linear-gradient(to right, #8e5efa, #4970fb) !important;
  width: 70%;
  height: 7px;
  border-radius: 50%;
}
</style>
