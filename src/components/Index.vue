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
                <svg class="lds-spinner spinner" v-if="proxies.length==0" width="200px" height="200px" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
                     style="background: none;">
                    <g transform="rotate(0 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(30 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(60 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s"
                                     repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(90 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(120 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(150 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s"
                                     repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(180 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(210 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(240 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s"
                                     repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(270 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(300 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                     begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                    <g transform="rotate(330 50 50)">
                        <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s"
                                     repeatCount="indefinite"></animate>
                        </rect>
                    </g>
                </svg>
                <span v-else-if="proxies.length > 0 && shownProxies.length == 0" class="not-found">There are no proxies with these properties</span>
                <div v-for="proxy in shownProxies" class="mb-4 proxy">
                    <span class="host">{{ proxy.host }}:{{ proxy.port }}</span>
                    <div class="row props">
                        <div class="col-sm-3">Use counter: {{ proxy.use_counter }}</div>
                        <div class="col-sm-9 col-lg-3">Alive: {{ proxy.alive }}</div>
                        <div class="col-sm-3">Country: {{ proxy.country }}</div>
                        <div class="col-sm-9 col-lg-3">Response time: {{ proxy.port_response_time }}</div>
                        <div class="col">Proxy type: {{ proxy.proxy_type == 0 ? 'Transparent' :
                                            proxy.proxy_type == 1 ? 'Anonymous' :
                                            'Elite' }}</div>
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
            .not-found
                font-size: 20px
                font-weight: 800
            .spinner
                display: block
                margin-left: auto
                margin-right: auto
            .proxy
                .host
                    font-weight: 800
                    font-size: 20px
</style>
