<template>
    <div class="container content">
        <div class="row position-relative">
            <aside class="col-md-3 mb-4 position-sm-absolute">
                <b-form-select class="mb-4"
                               :options="countries"
                               v-model="filter.country">
                </b-form-select>
                <b-form-group class="mb-4">
                    <b-form-checkbox v-for="option in proxyTypes"
                                     v-model="filter.proxyTypes"
                                     :key="option.value"
                                     :value="option.value">
                        {{ option.text }}
                    </b-form-checkbox>
                </b-form-group>
                <b-form-checkbox class="mb-4"
                                 v-model="filter.alive">
                    Alive
                </b-form-checkbox>
                <b-button @click="getProxies">Reload</b-button>
            </aside>
            <div class="col-md-9 ml-auto proxies-list">
                <img class="spinner" v-if="proxies.length==0" src="../assets/spinner.svg">
                <div v-for="proxy in shownProxies" class="mb-4 proxy">
                    <span class="host">{{ proxy.host }}:{{ proxy.port }}</span>
                    <div class="row props">
                        <div class="col-sm-3">Use counter: {{ proxy.use_counter }}</div>
                        <div class="col-sm-9 col-lg-3">Alive: {{ proxy.alive }}</div>
                        <div class="col-sm-3">Country: {{ proxy.country }}</div>
                        <div class="col-sm-9 col-lg-3">Response time: {{ proxy.port_response_time }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: 'Index',
        data() {
            return {
                filter: {
                    country: "",
                    proxyTypes: [],
                    alive: false
                },
                countries: [],
                proxies: [],
                shownProxies: [],
                proxyTypes: [
                    { value: 0, text: 'Transparent' },
                    { value: 1, text: 'Anonymous' },
                    { value: 2, text: 'Elite' }
                ]
            }
        },
        methods: {
            //Фильтрация
            proxyFilter() {
                this.shownProxies = [];
                for(let p of this.proxies) {
                    if((this.filter.country == p.country || this.filter.country == "") && (!this.filter.alive || p.alive)) {
                        for(let type of this.filter.proxyTypes) {
                            if(type == p.proxy_type) {
                                this.shownProxies.push(p);
                            }
                        }
                        if(this.filter.proxyTypes.length == 0) {
                            this.shownProxies.push(p);
                        }
                    }
                }
            },

            //Извлечение доступных стран
            getCountries() {
                let tlangs = [];
                for(let p of this.proxies) {
                    if(tlangs.indexOf(p.country) == -1) {
                        tlangs.push(p.country);
                    }
                }
                tlangs = tlangs.map((country)=>{
                    let capitalizedCountry = country[0].toUpperCase()+country.toLowerCase().slice(1);
                    return {
                        value: country,
                        text: capitalizedCountry
                    }
                });
                this.countries = [{value: "", text: "All"}].concat(tlangs);
            },

            //Ajax-запрос за проксями
            getProxies() {
                this.shownProxies = this.proxies = [];
                axios.get("/api/proxies/?format=json")
                     .then((res)=>{
                         this.proxies = res.data;
                         this.getCountries();
                         this.proxyFilter();
                     })
            }
        },
        mounted() {
            this.getProxies();
        },
        watch: {
            filter: {
                deep: true,
                handler: function() {
                    this.proxyFilter();
                }
            }
        }
    }
</script>

<style lang="sass">
    .content
        .proxies-list
            .spinner
                display: block
                margin-left: auto
                margin-right: auto
            .proxy
                .host
                    font-weight: 800
                    font-size: 20px
</style>
