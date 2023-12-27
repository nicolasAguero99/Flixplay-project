Vue.component('Peliculas', {
  props: ['titulo', 'peliculas-fav', 'get-poster-url', 'seleccionar-pelicula', 'peliculas-recomendadas', 'peliculas-top', 'peliculasPopulares'],
  template: `
    <div>
      <div>
        <h2 v-text='titulo'></h2>
      </div>
      <div>
        <div v-if="peliculasRecomendadas.length > 0" @click='seleccionarPelicula(item.id)' class='card-pelicula' v-for='(item, index) in peliculasRecomendadas' :key='index'>
          <img :src="getPosterUrl(item.poster_path)" :alt="'poster de ' + item.title">
          <span v-text="item.title"></span>
        </div>
        <div v-if="peliculasTop.length > 0" @click='seleccionarPelicula(item.id)' class='card-pelicula' v-for='(item, index) in peliculasTop' :key='index'>
          <img :src="getPosterUrl(item.poster_path)" :alt="'poster de ' + item.title">
          <span v-text="item.title"></span>
        </div>
        <div v-if="peliculasPopulares.length > 0" @click='seleccionarPelicula(item.id)' class='card-pelicula' v-for='(item, index) in peliculasPopulares' :key='index'>
          <img :src="getPosterUrl(item.poster_path)" :alt="'poster de ' + item.title">
          <span v-text="item.title"></span>
        </div>
      </div>
    </div>
  `
})

Vue.component('Favoritos', {
  props: ['peliculas-fav', 'get-poster-url', 'seleccionar-pelicula', 'cant-fav'],
  template: `
    <section class="secciones-home">
      <div>
        <div>
          <h2>Mis favoritos ({{cantFav()}})</h2>      
        </div>
        <div>
          <div @click='seleccionarPelicula(item.id, true)' class='card-pelicula' v-for='(item, index) in peliculasFav' :key='index'>
            <img :src="getPosterUrl(item.poster)" :alt="'poster de ' + item.titulo">
            <span v-text="item.titulo"></span>
          </div=>
        </div>
      </div>
    </section>
  `
})

const App = new Vue({
  el: "#app",
  data: {
    buscadorValue: "",
    filtrarPor: false,
    
    // peliculas
    peliculas: [],
    peliculaSeleccionada: [],
    peliculasRecomendadas: [],
    peliculasTop: [],
    peliculasPopulares: [],
    peliculasFav: [],
    peliculasFiltradasLista: [],

    // is
    isBusqueda: false,
    isPeliculaSeleccionada: false,
    isFav: false,
    isMenu: false,
    isFiltrar: true,

    // options api
    options: {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhN2RiODZjZTFlMTkzMzFhZmNiYzgxMzk1M2Q2Mzg0NyIsInN1YiI6IjY0OWM2ZGM0NzdjMDFmMDBhZThmN2E2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uqXpkvdDoapLpTh2GSfVQH44CaRG4aGsTfaHyLLKoIA'
      }
    },
  },
  created() {
    fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', this.options)
      .then(response => response.json())
      .then(response => this.peliculasRecomendadas = response.results.slice(0, 8))
      .catch(err => console.error(err));

    fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', this.options)
      .then(response => response.json())
      .then(response => this.peliculasTop = response.results.slice(0, 8))
      .catch(err => console.error(err));

    fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', this.options)
      .then(response => response.json())
      .then(response => this.peliculasPopulares = response.results.slice(6, 14))
      .catch(err => console.error(err));
  },

  computed: {
    peliculasMostrar() {
      let peliculasMostrar = this.peliculas
      return peliculasMostrar
    },
    peliculasLista() {
      let peliculasMostrarMenos = this.peliculas
      return peliculasMostrarMenos.slice(0, 8);
    },
    peliculasFiltradas() {
      let peliculas = this.peliculas
      let peliculasFiltradas = []
      console.log("d")
      peliculas.map(pelicula => {
        if(!this.filtrarPor || pelicula.original_language == this.filtrarPor) {
          console.log(pelicula.original_language)
          peliculasFiltradas.push(pelicula)
        }
      })
      return peliculasFiltradas;
    },
  },

  mounted() {
    // this.isFav && this.verFav();
    if(window.location.pathname == "/favoritos.html" || window.location.pathname == "/Flixplay-project/favoritos.html") {
      this.verFav();
    }
    if(window.location.pathname == "/" || window.location.pathname == "/Flixplay-project/") {
      localStorage.getItem("idFav") && 
      (
        this.seleccionarPelicula(localStorage.getItem("idFav")),
        localStorage.removeItem("idFav")
      );
    }
  },

  methods: {
    buscar() {
      fetch(`https://api.themoviedb.org/3/search/movie?query=${this.buscadorValue}&include_adult=false&language=en-US&page=1`, this.options)
      .then(response => response.json())
      .then(response => {this.peliculas = response.results})
      .catch(err => console.error(err));
      this.buscadorValue.length >= 1 ? (this.isBusqueda = true) : (this.isBusqueda = false)
    },
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    },
    puntuacionPelicula(puntuacion) {
      if(puntuacion == undefined) {return ""};
      let resultado = puntuacion.toString().replace('.', '').split('');
      resultado.splice(2, 0, ".");
      let resultadoJunto = Math.round(resultado.join(""));
      return resultadoJunto;
    },
    fechaPelicula(fecha) {
      let year = fecha.slice(0, fecha.indexOf("-"))
      return year;
    },
    seleccionarPelicula(id, fav) {
      let idPelicula;
      if (fav) {
        localStorage.setItem("idFav", id)
        idPelicula = localStorage.getItem("idFav")
        window.location.assign("./")
      } else {
        idPelicula = id
      }
      window.scrollTo(0, 0)
      this.isBusqueda = false;
      this.isPeliculaSeleccionada = true;
      fetch(`https://api.themoviedb.org/3/movie/${idPelicula}?language=en-US`, this.options)
      .then(response => response.json())
      .then(response => {this.peliculaSeleccionada = response; console.log(response);})
      .catch(err => console.error(err));
    },
    agregarFav(datos) {
      console.log(datos)
      localStorage.setItem(datos.titulo, JSON.stringify(datos))
    },
    cantFav() {
      return localStorage.length;
    },
    verFav() {
      this.isFav = true;
      this.peliculasFav = []; 
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        const peliculaFavData = localStorage.getItem(key);
        localStorage.key(i) != "idFav" && this.peliculasFav.push(JSON.parse(peliculaFavData))
      }
    },
  },  
})



// Service Worker

if ("serviceWorker" in navigator) {
  try {
    var swRegistration = navigator.serviceWorker.register("./serviceWorker.js");
    console.log("service worker registered");
  } catch (error) {
    console.log("service worker reg failed");
  }
} else {
  console.log("sw not supperted");
}