class RecintosZoo {
   constructor() {
      this.recintos = [
         {
            numero: 1,
            bioma: "savana",
            tamanhoTotal: 10,
            animais: { MACACO: 3 },
         },
         { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: {} },
         {
            numero: 3,
            bioma: "savana e rio",
            tamanhoTotal: 7,
            animais: { GAZELA: 1 },
         },
         { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: {} },
         { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: { LEAO: 1 } },
      ];
      this.animais = {
         LEAO: { tamanho: 3, bioma: "savana" },
         LEOPARDO: { tamanho: 2, bioma: "savana" },
         CROCODILO: { tamanho: 3, bioma: "rio" },
         MACACO: { tamanho: 1, bioma: "savana ou floresta" },
         GAZELA: { tamanho: 2, bioma: "savana" },
         HIPOPOTAMO: { tamanho: 4, bioma: "savana ou rio" },
      };
   }

   analisaRecintos(animal, quantidade) {
      const erros = {
         "Animal inválido": !(animal in this.animais),
         "Quantidade inválida": quantidade <= 0,
      };

      for (const [mensagem, condicao] of Object.entries(erros)) {
         if (condicao) {
            return { erro: mensagem, recintosViaveis: false };
         }
      }

      const biomas = this.animais[animal].bioma.split(" ou ");
      const espacoNecessario = this.animais[animal].tamanho * quantidade;

      const recintosViaveis = this.recintos
         .filter(
            (recinto) =>
               biomas.includes(recinto.bioma) &&
               recinto.tamanhoTotal > espacoNecessario
         )
         .map(
            (recinto) =>
               `Recinto ${recinto.numero} (espaço livre: ${
                  recinto.tamanhoTotal - espacoNecessario
               } total: ${recinto.tamanhoTotal})`
         );

      if (recintosViaveis.length === 0) {
         return { erro: "Não há recinto viável", recintosViaveis: false };
      }

      return { erro: false, recintosViaveis: recintosViaveis}

   }
}

export { RecintosZoo as RecintosZoo };
