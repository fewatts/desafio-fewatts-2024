class RecintosZoo {
   constructor() {
      // Dados dos recintos
      this.recintos = [
         {
            numero: 1,
            bioma: "savana",
            tamanhoTotal: 10,
            animais: [{ especie: "MACACO", quantidade: 3 }],
         },
         { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
         {
            numero: 3,
            bioma: "savana e rio",
            tamanhoTotal: 7,
            animais: [{ especie: "GAZELA", quantidade: 1 }],
         },
         { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
         {
            numero: 5,
            bioma: "savana",
            tamanhoTotal: 9,
            animais: [{ especie: "LEAO", quantidade: 1 }],
         },
      ];

      // Dados dos animais
      this.animais = {
         LEAO: { tamanho: 3, biomas: "savana" },
         LEOPARDO: { tamanho: 2, biomas: "savana" },
         CROCODILO: { tamanho: 3, biomas: "rio" },
         MACACO: { tamanho: 1, biomas: "savana ou floresta" },
         GAZELA: { tamanho: 2, biomas: "savana" },
         HIPOPOTAMO: { tamanho: 4, biomas: "savana ou rio" },
      };

      // Lista de carnívoros
      this.carnivoros = ["LEAO", "LEOPARDO", "CROCODILO"];
   }

   // Valida se o animal e a quantidade são válidos
   validadorDeDados(animal, quantidade) {
      if (!(animal in this.animais)) return { erro: "Animal inválido" };
      if (quantidade <= 0) return { erro: "Quantidade inválida" };
      return null;
   }

   // Determina os biomas onde o animal pode viver
   determinarBiomas(animal) {
      return this.animais[animal].biomas.split(" ou ");
   }

   // Calcula o espaço ocupado e necessário em um recinto
   calculaEspacos(recinto, animal, quantidade) {
      const espacoOcupado = recinto.animais.reduce(
         (total, a) => total + this.animais[a.especie].tamanho * a.quantidade,
         0
      );
      const espacoNecessario = quantidade * this.animais[animal].tamanho;
      return { espacoOcupado, espacoNecessario };
   }

   // Verifica se há carnívoros no recinto
   possuiCarnivoro(animaisDoRecinto) {
      return animaisDoRecinto.some((especie) =>
         this.carnivoros.includes(especie)
      );
   }

   // Verifica se é possível adicionar um carnívoro no recinto
   podeAdicionarCarnivoro(recinto, animal) {
      const animaisDoRecinto = recinto.animais.map((a) => a.especie);
      const possuiCarnivoro = this.possuiCarnivoro(animaisDoRecinto);
      const recintoEstaVazio = recinto.animais.length === 0;
      const mesmaEspecie = animaisDoRecinto.includes(animal);
      return (possuiCarnivoro && mesmaEspecie) || recintoEstaVazio;
   }

   // Verifica se é possível adicionar macacos no recinto
   podeAdicionarMacaco(recinto, quantidade) {
      const possuiCarnivoro = this.possuiCarnivoro(
         recinto.animais.map((a) => a.especie)
      );
      return (recinto.animais.length > 0 || quantidade > 1) && !possuiCarnivoro;
   }

   // Verifica se é possível adicionar hipopótamos no recinto
   podeAdicionarHipopotamo(recinto) {
      const possuiCarnivoro = this.possuiCarnivoro(
         recinto.animais.map((a) => a.especie)
      );
      return (
         (recinto.bioma.includes("savana") &&
            recinto.bioma.includes("rio") &&
            !possuiCarnivoro) ||
         recinto.animais.length === 0
      );
   }

   // Verifica se o recinto possui animais de outra espécie
   possuiAnimalDeOutraEspecie(recinto, especie) {
      return (
         recinto.animais.length > 0 &&
         recinto.animais.some((a) => a.especie !== especie)
      );
   }

   // Analisa os recintos para determinar onde o animal pode ser adicionado
   analisaRecintos(animal, quantidade) {
      const erro = this.validadorDeDados(animal, quantidade);
      if (erro) return erro;

      const biomas = this.determinarBiomas(animal);
      const resultado = [];

      this.recintos.forEach((recinto) => {
         const incluiBioma = biomas.some((bioma) =>
            recinto.bioma.includes(bioma)
         );
         const { espacoOcupado, espacoNecessario } = this.calculaEspacos(
            recinto,
            animal,
            quantidade
         );

         if (
            incluiBioma &&
            espacoOcupado + espacoNecessario <= recinto.tamanhoTotal
         ) {
            if (this.carnivoros.includes(animal)) {
               if (this.podeAdicionarCarnivoro(recinto, animal)) {
                  resultado.push(
                     `Recinto ${recinto.numero} (espaço livre: ${
                        recinto.tamanhoTotal - espacoOcupado - espacoNecessario
                     } total: ${recinto.tamanhoTotal})`
                  );
               }
            } else {
               let ajusteEspaco = 0;

               if (this.possuiAnimalDeOutraEspecie(recinto, animal)) {
                  ajusteEspaco = 1;
               }

               if (animal === "MACACO") {
                  if (this.podeAdicionarMacaco(recinto, quantidade)) {
                     resultado.push(
                        `Recinto ${recinto.numero} (espaço livre: ${
                           recinto.tamanhoTotal -
                           espacoOcupado -
                           espacoNecessario -
                           ajusteEspaco
                        } total: ${recinto.tamanhoTotal})`
                     );
                  }
               } else if (animal === "HIPOPOTAMO") {
                  if (this.podeAdicionarHipopotamo(recinto)) {
                     resultado.push(
                        `Recinto ${recinto.numero} (espaço livre: ${
                           recinto.tamanhoTotal -
                           espacoOcupado -
                           espacoNecessario -
                           ajusteEspaco
                        } total: ${recinto.tamanhoTotal})`
                     );
                  }
               } else {
                  const possuiCarnivoro = this.possuiCarnivoro(
                     recinto.animais.map((a) => a.especie)
                  );
                  if(!possuiCarnivoro){
                     resultado.push(
                        `Recinto ${recinto.numero} (espaço livre: ${
                           recinto.tamanhoTotal -
                           espacoOcupado -
                           espacoNecessario -
                           ajusteEspaco
                        } total: ${recinto.tamanhoTotal})`
                     );
                  }
               }
            }
         }
      });

      if (resultado.length) {
         return { recintosViaveis: resultado.sort() };
      } else {
         return { erro: "Não há recinto viável" };
      }
   }
}

export { RecintosZoo as RecintosZoo };
