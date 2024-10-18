<template>
  <v-dialog

    :persistent="true"
    max-width="500"
    v-model="quizDialog"
    transition="dialog-bottom-transition"
    width="auto"
    ><v-card class="px-2 py-2">
      <p>can the attacker be easily recognized (based on point of origin)</p>
      <v-radio-group v-model="attackerRecog">
        <v-radio label="yes" value="1"></v-radio>
        <v-radio label="no" value="0"></v-radio>
      </v-radio-group>
      <p>was this a ddos aro dos attack</p>
      <v-radio-group v-model="ipTypeAttack">
        <v-radio label="DDoS" value="0"></v-radio>
        <v-radio label="DoS" value="1"></v-radio>
        <v-radio label="hmmmmm" value="-1"></v-radio>
      </v-radio-group>
      <div v-if="showAttackerTextField">
        <p>who is the attacker (enter the ip adress)</p>
        <v-text-field
          v-model="whoIsAttackerIP"
          label="ip adress"
        ></v-text-field>
      </div>
      <p>what type of an attack targeted you</p>
      <v-radio-group v-model="typeofAttack">
        <v-radio label="SYN flood" value="1"></v-radio>
        <v-radio label="https flood" value="2"></v-radio>
        <v-radio label="dns flood" value="3"></v-radio>
        <v-radio label="other" value="4"></v-radio>
      </v-radio-group>
      <div class="d-flex justify-end">
        <v-btn
          class="mt-2 mx-1"
          color="primary"
          max-width="140"
          @click="showEndScreen"
          >check answer
        </v-btn>
        <v-btn
          class="mt-2"
          color="primary"
          max-width="110"
          @click="showQuizDialog"
          >close
        </v-btn>
      </div>
    </v-card></v-dialog
  >
</template>

<script lang="ts">
import { ref, type PropType, defineComponent } from "vue";

interface quizAnswers {
  ddosOrDos: boolean;
  AttackerSrc: string;
  attackType: number;
}
interface QuizQADialogCorrect {
  typeofAttack: number;
  whoIsAttacker: string;
  isAttackerRec: string;
  isDosOrDDos: string;
  mitigationStrategy: string;
}

export default defineComponent({
  props: {
    quizAnswers: {
      type: Object as PropType<quizAnswers>,
    },
    quizDialog: Boolean,
  },
  data() {
    return {
      attackerRecog: "0",
      ipTypeAttack: "0",
      whoIsAttackerIP: "",
      typeofAttack: "0",

      quizQADialoginput: {},
      succesFlag: false,
    };
  },
  /**
   * v-if="$refs.attackerRecog"
   * send to
   * line chart 3 each interval give more data
   */
  methods: {
    showEndScreen() {
      if (this.checkAnswers()) {
        this.$emit("showDeathScreen",false);
      }else{
        this.$emit("showDeathScreen",true);
      }
    },
    checkAnswers() {
      console.log("answers:"+ this.attackerRecog +" ddos: "+this.ipTypeAttack+" whoIs: "+this.whoIsAttackerIP+ " type of attack: "+this.typeofAttack)
      console.log("state:"+ this.quizQADialogCorrect.isAttackerRec +" ddos: "+this.quizQADialogCorrect.isDosOrDDos+" whois: "+this.quizQADialogCorrect.whoIsAttacker + " type of Attack: "+ this.quizQADialogCorrect.typeofAttack)
      let flag = true;
      if (this.attackerRecog !== this.quizQADialogCorrect.isAttackerRec) {
        flag = false;
        console.log("came to 1")
        return flag;
      }
      if (this.ipTypeAttack !== this.quizQADialogCorrect.isDosOrDDos) {
        flag = false;
        console.log("came to 2")
        return flag;
      }

      if (this.typeofAttack !== this.quizQADialogCorrect.typeofAttack.toString()) {
        flag = false;
        console.log("came to 3")
        return flag;
      }
      if (this.quizQADialogCorrect.isAttackerRec === "1") {
        if (this.whoIsAttackerIP !== this.quizQADialogCorrect.whoIsAttacker) {
          flag = false;
          console.log("came to 4")
          return flag;
        }
      }
      console.log("succes")
      return flag;
    },
    showQuizDialog() {
      this.$emit("showQuizDialog", false);
    },
  },
  computed: {
    showAttackerTextField(): boolean {
      return this.attackerRecog === "1";
    },
    quizQADialogCorrect(): QuizQADialogCorrect {
      if (this.quizAnswers?.ddosOrDos) {
        return {
          typeofAttack: this.quizAnswers?.attackType as number,
          whoIsAttacker: this.quizAnswers?.AttackerSrc as string,
          isAttackerRec: "0",
          isDosOrDDos: "0",
          mitigationStrategy: "",
        };
      } else {
        return {
          typeofAttack: this.quizAnswers?.attackType as number,
          whoIsAttacker: this.quizAnswers?.AttackerSrc as string,
          isAttackerRec: "1",
          isDosOrDDos: "1",
          mitigationStrategy: "",
        };
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
