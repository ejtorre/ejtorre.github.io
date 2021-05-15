const CompGoogleSignInButton = {
    props: {
        view: Boolean,
        label: String
    },
    template:`
    <button class="button is-outlined" v-if="view" @click="$emit('googleButtonClick')">
        <span class="icon">
            <figure class="image is-16x16">
                <img src="/assets/img/google-icon.svg">
            </figure>            
        </span>
        <span>{{label}}</span>
    </button>`
}

const CompGoogleRevokeAccessButton = {
    props: {
        view: Boolean,
        label: String
    },
    template: `
    <button class="button is-outlined" v-if="view" @click="$emit('googleButtonClick')">
        <span class="icon">
            <i class="fas fa-ban"></i>
        </span>
        <span>{{label}}</span>
    </button>`
}

const CompDataSummary = {
    props: {        
        data: Object
    },
    template:`    
    <p class="subtitle">
        <span class="icon-text">
            <span class="icon">
                <i class="far fa-calendar-alt"></i>
            </span>
            <span>{{data.date}}</span>
        </span>
    </p>
    <div class="level">
        <div class="level-item has-text-centered" v-for="(value, field) in data.data">
            <div>
                <p class="heading">{{field}}</p>
                <p class="title">{{value}}</p>    
            </div>
        </div>
    </div>`
}

const CompDataHistory = {
    props: {        
        data: Object
    },
    template:`
    <table class="table is-striped is-narrow is-fullwidth">
        <thead>
            <tr>
                <th v-for="(value, index) in data.fields" :key="index">
                    {{value}}
                </th>
            </tr>                
        </thead>
        <tbody>
            <tr v-for="(row, indexRow) in data.data" :key="indexRow">
                <td v-for="(value, indexCell) in row" :key="indexCell">
                    {{value}}
                </td>
            </tr>
        </tbody>
    </table>`
}

const CompRoot = {
    data() {
        return {
            signInOutMsg: 'Por favor, incia sesión con tu cuenta de Google y, si no las hecho ya, permite el acceso a esta app para poder mostrate los datos.',
            signInLabel: 'Iniciar sesión/autorizar',
            signInView: true,
            signOutLabel: 'Retirar permisos',
            signOutView: false,            
            apiKey: 'AIzaSyBZd85BxtP67CoKjnFI7KoX4Im_euc6U_A',
            clientId: '187178059883-v97sb95tgdfug12u0ha6mp66j8hmcsfa.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
            discoveryUrl: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            GoogleAuth: undefined,
            patientInfo: {
                name: "Eusebio José de la Torre Niño",
                img: "/assets/img/personal-information.svg",
                email: "ej.torre.nino@gmail.com"
            },
            userInfo: {
                name: "Desconocido",
                img: "/assets/img/bag-on-head.svg",
                email: ""
            },
            ssId: '1HyWIpOOAClVDDr_BE8t0_mOEirif4k0pURTeYaUAhhg',
            ssRange: 'Datos!A1:I',
            ssData: [],            
            ssFields: {
                'Fecha/Hora': {
                    description: "Fecha",
                    type: "date",
                    name: 'date'
                },
                'Día de la semana': {
                    description: "Día de la semana",
                    type: "number",
                    name: 'DateWeekDate'
                },
                'Lugar': {
                    description: "Lugar",
                    type: "string",
                    name: 'place'
                },
                'Peso (Kg)': {
                    description: "Peso (Kg)",
                    type: "number",
                    name: 'weight'
                },
                'IMC (Índice de Masa Corporal)': {
                    description: "IMC (Índice de Masa Corporal)",
                    type: "number",
                    name: 'BMI'
                },
                'Sístole (mmHg)': {
                    description: "Sístole (mmHg)",
                    type: "number",
                    name: "systole"
                },
                'Diástole (mmHg)': {
                    description: "Diástole (mmHg)",
                    type: "number",
                    name: "diastole"
                },
                'Presión del pulso': {
                    description: "Presión del pulso",
                    type: "number",
                    name: "pulsePressure"
                },
                'Pulso (pulsaciones por minuto)': {
                    description: "Pulso (pulsaciones por minuto)",
                    type: "number",
                    name: "pulse"
                }
            },
            dataView: false,
            fields: {},
            data: [],            
            fieldDate: 'date',
            formatDate: new Intl.DateTimeFormat('es-ES', {dateStyle: 'long'}),
            formatNumber: new Intl.NumberFormat('es-ES', {maximumFractionDigits: 3}),
            histFields: ['date', 'weight','BMI','systole','diastole'],
            summaryFields: ['weight','BMI','systole','diastole']
        }
    },    
    computed: {        
        histData() {
            
            if ( Object.entries(this.fields).length > 0 ) {
            
                var fields = [];
                for (var j = 0; j < this.histFields.length; j++) {
                    fields.push(this.fields[this.histFields[j]].description);
                }

                var data = [];
                for (var i = 1; i < this.data.length; i++) {
                    var row = []
                    for (var j = 0; j < this.histFields.length; j++) {
                        row.push(this.data[i][this.histFields[j]].valueTxt);
                    }
                    data.push(row)
                }            

                return {
                    fields: fields,
                    data: data
                }
            
            }
            else {
                return undefined;
            }
            
        },       
        summaryData() {
            
            if ( Object.entries(this.fields).length > 0 ) {
                var lastDate = this.data[0][this.fieldDate].valueTxt;
                var data = {};
                for (var j = 0; j < this.summaryFields.length; j++) {
                    var fieldName = this.fields[this.summaryFields[j]].description;
                    var fieldValue = this.data[0][this.summaryFields[j]].valueTxt;                    
                    data[fieldName] = fieldValue
                }
                return {
                    date: lastDate,
                    data: data
                }                
            }
            else {
                return undefined;                
            }            
        }
    },
    methods: {
        handleClientLoad() {
            gapi.load('client:auth2', this.initClient);
        },        
        initClient() {
            var that = this;
            gapi.client.init({
                'apiKey': this.apiKey,
                'clientId': this.clientId,
                'scope': this.scope,
                'discoveryDocs': this.discoveryUrl                
            }).then(function(){
                that.GoogleAuth = gapi.auth2.getAuthInstance();
                that.GoogleAuth.isSignedIn.listen(that.updateSigninStatus);
                that.setSigninStatus();                
            })
        },
        setSigninStatus() {
            var user = this.GoogleAuth.currentUser.get();
            if (typeof user.getBasicProfile() != "undefined") {
                this.userInfo = {
                    name: user.getBasicProfile().getName(),
                    img: user.getBasicProfile().getImageUrl(),
                    email: user.getBasicProfile().getEmail()
                };                
            }            
            var isAuthorized = user.hasGrantedScopes(this.scope);
            if (isAuthorized) {
                this.signInView = true;
                this.signInLabel = "Terminar sesión"; 
                this.signOutView = true;                
                this.signInOutMsg = "¡¡¡Gracias!!! Has iniciado sesión y has autorizado el acceso de esta app. Ya puedes ver los datos."                
                this.makeApiCall();
            }
            else {
                this.signInView = true;
                this.signInLabel = "Iniciar sesión/autorizar";
                this.signOutView = false;
                this.signInOutMsg = 'Por favor, incia sesión con tu cuenta de Google y, si no las hecho ya, permite el acceso a esta app para poder mostrate los datos.';
                this.ssData = [];
                this.data = [];
                this.fields = {};
                this.dataView = false;
                this.userInfo = {
                    name: "Desconocido",
                    img: "/assets/img/bag-on-head.png",
                    email: ""
                };
            }
        },
        updateSigninStatus() {
            this.setSigninStatus();
        },
        handleAuthClick() {
            if (this.GoogleAuth.isSignedIn.get()) {                
                this.GoogleAuth.signOut();                
            }
            else {                
                this.GoogleAuth.signIn();                
            }
        },
        revokeAccess() {
            this.GoogleAuth.disconnect();            
        },
        makeApiCall() {
            var that = this
            gapi.client.sheets.spreadsheets.values.get({
                'spreadsheetId': this.ssId,
                'range': this.ssRange,
                'dateTimeRenderOption': "SERIAL_NUMBER",
                'majorDimension': "ROWS",
                'valueRenderOption': "UNFORMATTED_VALUE"
                
            }).then(function(resp) {
                that.ssData = resp.result.values;
                that.fields = that.getFields();
                that.data = that.getData();
                that.dataView = true;                
            }, function(){
                that.signInOutMsg = "Gracias por inciar sesión y autorizar los accesos pero el administrador no te conoce y no puedo mostrate los datos. Ponte en contacto con el administrador."
            });
        },
        getFields() {
            var result = {};
            for (var i = 0; i < this.ssData[0].length; i++) {
                var fieldsInfo = this.ssFields[this.ssData[0][i]];
                result[fieldsInfo.name] = {
                    description: fieldsInfo.description,
                    type: fieldsInfo.type,
                    nameOri: this.ssData[0][i],
                    indexOri: i
                }
            }
            return result;       
        },
        getData() {
            var that = this;            
            var result = [];            
            for (var i = 1; i < this.ssData.length; i++) {
                var rowObj = {};
                    for (var [key, value] of Object.entries(this.fields)) {
                        var fieldValueOri = this.ssData[i][value.indexOri];
                        if (value.type == 'date') {                            
                            var fieldValue = this.ssDateToJSDate(fieldValueOri);
                            var fieldValueTxt = this.formatDate.format(fieldValue);
                        }
                        else if (value.type == 'number') {
                            var fieldValue = new Number(fieldValueOri);
                            var fieldValueTxt = this.formatNumber.format(fieldValue);
                        }
                        else {
                            var fieldValue = fieldValueOri;
                            var fieldValueTxt = fieldValueOri;
                        }
                        rowObj[key] = {
                          value: fieldValue,
                          valueTxt: fieldValueTxt    
                        }
                    }
                    result.push(rowObj);
            }
            function compare( a, b ) {
                if ( a[that.fieldDate].value > b[that.fieldDate].value ){
                    return -1;
                }
                if ( a[that.fieldDate].value < b[that.fieldDate].value ){
                    return 1;
                }
                return 0;
            }            
            return result.sort(compare)
        },        
        ssDateToJSDate(serial) {
            var utc_days  = Math.floor(serial - 25569);
            var utc_value = utc_days * 86400;                                        
            var date_info = new Date(utc_value * 1000);
            var fractional_day = serial - Math.floor(serial) + 0.0000001;
            var total_seconds = Math.floor(86400 * fractional_day);
            var seconds = total_seconds % 60;
            total_seconds -= seconds;
            var hours = Math.floor(total_seconds / (60 * 60));
            var minutes = Math.floor(total_seconds / 60) % 60;
            return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
        }
    }
}

const app = Vue.createApp(CompRoot);
app.component('google-sign-in-button', CompGoogleSignInButton);
app.component('google-revoke-access-button', CompGoogleRevokeAccessButton);
app.component('level-summary', CompDataSummary);
app.component('table-history',CompDataHistory)
const vm = app.mount('#app');

function star() {    
    vm.handleClientLoad();
}
