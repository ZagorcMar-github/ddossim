<template>
  <v-card height="520px">
    <!-- Add the 'fixed-layout' class here -->

    <v-row class="mt-1 mx-1">
      <v-col align="left">time</v-col>
      <v-col align="left">source</v-col>
      <v-col align="left">destination</v-col>
      <v-col align="left">protocol</v-col>
      <v-col align="left">information</v-col>
    </v-row>
    <v-divider></v-divider>

    <v-virtual-scroll :items="packetData" height="520px">
      <template v-slot:default="{ item }">
        <v-row :class="item.attack ? 'bg-red-lighten-1' : ''" class="mx-1">
          <v-col align="left">{{ item.time }}</v-col>
          <v-col align="left">{{ item.sourceIP }}</v-col>
          <v-col align="left">{{ item.destinationIP }}</v-col>
          <v-col align="left">{{ item.protocol }}</v-col>
          <v-col align="left">{{ item.information }}</v-col>
        </v-row>
      </template>
    </v-virtual-scroll>

    <!-- Close the table for the rows -->

    <!-- Close the table for the headers -->
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
interface Packet {
  time: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  information: string;
  attack: boolean;
}
interface quizAnswers {
  ddosOrDos: boolean;
  AttackerSrc: string;
  attackType: number;
}

  const props = defineProps({
    quizAnswers: {
      type: Object as PropType<quizAnswers>,
    },
    numberOfPackets: Number,
    triggerAttack: Boolean,
  })

      const localPAdress= "150.241.131.242"
      const  packetData= ref([] as Packet[])
      const  visiblepacketData= [] as Packet[]
      const  startStop= ref(false)
      const  virtualLength= ref(12)
      const  cards= ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as Array<number>)

    
    function togglePacketCreation() {
      startStop.value = !startStop.value;
      if (startStop.value) {
        createPacket();
      }
    }
    defineExpose({
      togglePacketCreation
    });
    
    /**
     * tcp info (50000-70000 -> 80 or 470) seq=0-200 ack=1 win=1 wait x seconds  destip sorce ip swap=>lahk tut 5 way handshake
     * udp info 50000-70000 -> 80 or 470  swap after imidiete
     * TLSv1.2 info aplication data
     * quic ->info protected payload (kp0) DCID=3dvsyyx https v bistvu
     * DNS ->info staandard query safebrwosing google apis
     * SYN fload =>tcp info (50000-70000 -> 80 or 470) seq=0-200 ack=0
     *DNS fload info= unknown operation unused <root> unused <root> unused <root> unused <root>
     * http fload info= public resest, CID=0
     *
     *
     */
    function createDNSFlood(source: string, DDos: boolean) {
     
      
      for (let index = 0; index < 100; index++) {
        if (DDos) {
          source = createIP();
        }
        let booleanData=true;
        createAndPushPacket(
          source,
          localPAdress,
          `Unknown operation (13) 0x666c Unused <Root> Unused <Root> Unused <Root> Unused <Root> Unused <Root> Unused <Root> Unused <Root>`,
          "DNS",
          booleanData
        );
        
      }
    }
    function createHTTPFlood(source: string, DDos: boolean) {
    
      for (let index = 0; index < 100; index++) {
        if (DDos) {
          source = createIP();
        }
        let booleanData=true;
        createAndPushPacket(
          source,
          localPAdress,
          `Public reset, CID:0`,
          "QUIC",
          booleanData
        );
       
      }
    }
    function createSynFlood(source: string, DDos: boolean) {

      for (let index = 0; index < 100; index++) {
        if (DDos) {
          source = createIP();
        }
        let booleanData=true;
        createAndPushPacket(
          source,
          localPAdress,
          `seq=0 win=0 len=0`,
          "TCP",
          booleanData
        );

      }
    }
    function triggerDDoS(source: string, DDos: boolean, randomNumber: number) {

      if (randomNumber === 1) {
        createSynFlood(source, DDos);
      } else if (randomNumber === 2) {
        createHTTPFlood(source, DDos);
      } else {
        createDNSFlood(source, DDos);
      }
    }
    function createIP() {
      let a,
        b,
        c,
        d = 0;
      let ipAdress = "";
      a = Math.floor(Math.random() * 171) + 85;
      b = Math.floor(Math.random() * 256);
      c = Math.floor(Math.random() * 256);
      d = Math.floor(Math.random() * 256);
      ipAdress = `${a}.${b}.${c}.${d}`;
      return ipAdress;
    }
    function createDNS() {
      //2 -> 2 odgovora
      //1 -> 1 odgovor
      //do 4 ->
      let dnsIPSrc = createIP();
      let repetitions: number;
      repetitions = Math.floor(Math.random() * 3) + 1;
      for (let index = 0; index < repetitions; index++) {
        pushToDataArray({
          time: Date(),
          sourceIP: dnsIPSrc,
          destinationIP: localPAdress,
          protocol: "DNS",
          information: "standard query",
          attack:false
        });
      }
      if (repetitions <= 2) {
        for (let index = 0; index < repetitions; index++) {
          pushToDataArray({
            time: Date(),
            sourceIP: localPAdress,
            destinationIP: dnsIPSrc,
            protocol: "DNS",
            information: "standard query",
            attack:false
          });
        }
      }
    }
    function createTLSv12(
      time: string,
      sourceIP: string,
      destinationIP: string,
      information: string
    ) {
      createAndPushPacket(sourceIP,destinationIP,information,"TLSv1.2")
    }
    function createAndPushPacket(
      sourceIP: string,
      destinationIP: string,
      information: string,
      protocol: string = "TCP",
      attackdata: boolean = false
    ) {
      const packet: Packet = {
        time: Date(),
        sourceIP: sourceIP,
        destinationIP: destinationIP,
        protocol: protocol,
        information: information,
        attack: attackdata,
      };
      pushToDataArray(packet);
    }
    function createQUIC() {
      let randomto30 = Math.floor(Math.random() * 29) + 1;
      let src: string = createIP();
      let destination = localPAdress;
      for (let index = 0; index < randomto30; index++) {
        createAndPushPacket(src, destination, "protected payload", "QUIC");
        setTimeout(() => {
          createAndPushPacket(destination, src, "protected payload");
        }, randomto30 * 100);
      }
    }
    //0.5 ->tcp443
    //0.1 ->tcp80
    //0.2 ->dns
    //0.2 ->quic
    function distributePackets() {
      // Generate a random number between 0 and 1 for distribution
      const randomValue = Math.random();

      // Define the probabilities for each packet type
      const tcpProbability = 0.6;
      const dnsProbability = 0.15;
      const quicProbability = 0.15;

      if (randomValue <= tcpProbability) {
        // Create a TCP packet
        createTCP();
      } else if (randomValue <= tcpProbability + dnsProbability) {
        // Create a DNS packet
        createDNS();
      } else if (
        randomValue <=
        tcpProbability + dnsProbability + quicProbability
      ) {
        // Create a QUIC packet
        createQUIC();
      } else {
        // Create a TCP80 packet

        createTCP80(Math.random() < 0.7);
      }
    }
    function createTCP80(withHTTP: boolean) {
      let randomizer: number;
      let outboundPort: number;
      let inboundPort: number;
      let randomTime: number;

      randomizer = Math.floor(Math.random()) + 1;
      randomTime = Math.floor(Math.random() * 1000) + 1;
      let time = Date();
      const createRAndomNumber = () => {
        return Math.floor(Math.random() * 10000) + 1000;
      };

      outboundPort = Math.floor(Math.random() * 15000) + 50000;
      inboundPort = 80;
      let sourc80IP = createIP();
      let destinationIP = localPAdress;
      let temporarySeq: number;
      let temporaryPort: number;
      if (withHTTP) {
        let protocol = "HTTP";
        let seq = 0;
        let ack = 1;
        let temporaryVariable: string;
        for (let index = 0; index < 4; index++) {
          if (index == 2) {
            ack = createRAndomNumber();
          }
          createAndPushPacket(
            sourc80IP,
            destinationIP,

            `${inboundPort}->${outboundPort} seq=${seq} ack=${ack}`,
            protocol
          );
          if (index == 1) {
            createAndPushPacket(
              sourc80IP,
              destinationIP,

              ` GET /connect.txt HTTP/1.1`,
              protocol
            );
          }
          if (index == 2) {
            createAndPushPacket(
              sourc80IP,
              destinationIP,
              `HTTP/1.1 200 OK (text/plain)`,
              protocol
            );
            seq = createRAndomNumber();
            createAndPushPacket(
              sourc80IP,
              destinationIP,
              `${inboundPort}->${outboundPort} seq=${seq} ack=${ack}`
            );
          }
          seq++;
          temporaryVariable = sourc80IP;
          sourc80IP = destinationIP;
          destinationIP = temporaryVariable;
          temporaryPort = inboundPort;
          inboundPort = outboundPort;
          outboundPort = temporaryPort;
          temporarySeq = seq;
          seq = ack;
          ack = temporarySeq;
        }
      } else {
        for (let index = 2; index < randomizer; index++) {
          let seq = createRAndomNumber();
          let ack = createRAndomNumber();
          createAndPushPacket(
            sourc80IP,
            localPAdress,
            `${outboundPort}->${inboundPort} seq=${seq} ack=${ack}`
          );
          setTimeout(() => {
            createAndPushPacket(
              localPAdress,
              sourc80IP,
              `${inboundPort}->${outboundPort} seq=${ack} ack=${seq + 1}`
            );
          }, randomTime);
        }
      }
    }
    function createTCP() {
      let time: string;
      let sourceIP: string;
      let outboundPort: number;
      let inboundPort: number;
      let win: number;
      time = Date();

      outboundPort = Math.floor(Math.random() * 15000) + 50000;
      inboundPort = 443;
      const createRAndomNumber = () => {
        return Math.floor(Math.random() * 10000) + 1000;
      };
      sourceIP = createIP();
      let ack: number;
      let numberOfrepetitions = Math.floor(Math.random() * 2 + 1);
      ack = createRAndomNumber();

      //start of a whole tc handshake
      createAndPushPacket(
        sourceIP,
        localPAdress,
        `${outboundPort}->${inboundPort} seq=0 win= len=0`
      );
      createAndPushPacket(
        localPAdress,
        sourceIP,
        `${inboundPort}->${outboundPort} seq=0 ack=1 win= len=0`
      );
      createAndPushPacket(
        sourceIP,
        localPAdress,
        `${outboundPort}->${inboundPort} seq=1 ack=1 win= len=0`
      );
      createTLSv12(time, sourceIP,localPAdress, "client hello");
      for (let index = 1; index <= numberOfrepetitions; index++) {
        createAndPushPacket(
          localPAdress,
          sourceIP,
          `${inboundPort}->${outboundPort} seq=1 ack=${ack} win= len=0`
        );
      }

      for (let index = 1; index <= numberOfrepetitions + 1; index++) {
        createAndPushPacket(
          localPAdress,
          sourceIP,
          `${inboundPort}->${outboundPort} seq=${createRAndomNumber()} ack=${ack} win= len=0`
        );
      }
      createAndPushPacket(
        sourceIP,
        localPAdress,
        `${outboundPort}->${inboundPort} seq=${ack} ack=${createRAndomNumber()}`
      );
      createTLSv12(time, localPAdress, sourceIP, "server Hello");
      for (let index = 1; index <= 4; index++) {
        createAndPushPacket(
          localPAdress,
          sourceIP,
          `${inboundPort}->${outboundPort} seq=${createRAndomNumber()} ack=${createRAndomNumber()} win= len=0`
        );
      }
    }
    function pushToDataArray(packet: Packet) {
      packetData.value.push({
        time: packet.time,
        sourceIP: packet.sourceIP,
        destinationIP: packet.destinationIP,
        protocol: packet.protocol,
        information: packet.information,
        attack:packet.attack
      });
    }
    const emit = defineEmits(['fillQuestionnaire']);
    async function  createPacket() {
      let triggerDDosOrDos: boolean;
      let sourceIPofAttacker: string;
      let randomof3: number;//1 syn  //2 http //3 dns
      randomof3 = Math.floor(Math.random()*3)+1;
      console.log("chosen of 3: "+randomof3)
      sourceIPofAttacker = createIP()
      
      triggerDDosOrDos = Math.random() < 0.5;
      
      console.log({ddosOrDos:triggerDDosOrDos,AttackerSrc:sourceIPofAttacker,attackType:randomof3})
      
      emit("fillQuestionnaire",{ddosOrDos:triggerDDosOrDos,AttackerSrc:sourceIPofAttacker,attackType:randomof3})
      while (startStop.value) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (props.triggerAttack) {
          triggerDDoS(sourceIPofAttacker, triggerDDosOrDos, randomof3);
        } else {
          distributePackets();
        }
      }
    }

  onMounted(()=> {
    createPacket();
  })
  
</script>

<style lang="scss" scoped></style>
