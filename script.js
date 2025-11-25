document.addEventListener('DOMContentLoaded', () => {

    //  HISTÓRICO 
    const searchHistory = []; // Array que guarda as buscas enquanto a página está aberta
    const historyList = document.getElementById('history-list'); // Local onde o histórico aparece


    // ELEMENTOS DA TELA 
    const searchButton = document.getElementById('search-button');
    const pokemonInput = document.getElementById('pokemon-input');
    const pokemonInfoDiv = document.getElementById('pokemon-info');


    // EVENTO DO BOTÃO 
    searchButton.addEventListener('click', () => {
        const pokemonNameOrId = pokemonInput.value.toLowerCase().trim();
        
        if (pokemonNameOrId) {
            fetchPokemon(pokemonNameOrId);
        } else {
            pokemonInfoDiv.innerHTML = '<p>Por favor, digite o nome ou ID do Pokémon.</p>';
        }
    });



    // BUSCAR POKÉMON NA API 
    async function fetchPokemon(query) {
        pokemonInfoDiv.innerHTML = '<p>Carregando...</p>';
        
        try {
            const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Pokémon não encontrado!');
            }
            
            const data = await response.json();

            addToHistory(data.name); // salva no histórico
            displayPokemon(data);    // mostra o Pokémon

        } catch (error) {
            pokemonInfoDiv.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        }
    }



    // EXIBIR POKÉMON NA TELA 
    function displayPokemon(pokemon) {

        // Formata os tipos com letra maiúscula
        const types = pokemon.types
            .map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
            .join(', ');

        // Fallback da imagem:
        // Usa front_default se existir
        // Se não, usa a imagem oficial da artwork
        const pokeImage =
            pokemon.sprites.front_default ||
            pokemon.sprites.other['official-artwork'].front_default;

        const htmlContent = `
            <h2>${pokemon.name} (#${pokemon.id})</h2>

            <!-- Linha atualizada para garantir que a imagem sempre apareça -->
            <img src="${pokeImage}" alt="${pokemon.name}">

            <p><strong>Tipo(s):</strong> ${types}</p>
            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        `;

        pokemonInfoDiv.innerHTML = htmlContent;
    }



    //  ADICIONAR AO HISTÓRICO 
    function addToHistory(name) {
        if (!searchHistory.includes(name)) {
            searchHistory.push(name);
        }
        displayHistory(); // atualiza a tela
    }



    // MOSTRAR HISTÓRICO NA TELA 
    function displayHistory() {
        historyList.innerHTML = ""; // limpa antes de reexibir

        searchHistory.forEach(pokeName => {
            const li = document.createElement('li');
            const link = document.createElement('a');

            link.textContent = pokeName;
            link.href = "#";

            // clicar no nome refaz a busca
            link.addEventListener('click', () => {
                fetchPokemon(pokeName);
            });

            li.appendChild(link);
            historyList.appendChild(li);
        });
    }

});
