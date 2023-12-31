const { createApp, onBeforeMount, reactive, onMounted, computed,ref } = Vue
let asset_id = location.pathname;
asset_id = asset_id.split('/');
asset_id = asset_id[asset_id.length - 1];
console.log(asset_id);
NProgress.configure({parent:'#deletebqqdf'})
const app = createApp({
    setup() {

        const data = reactive({
            username: 'aaaa',
            postavater: '',
            imagepath: '',
            postintro: '',
            postdate: '',
            public_id: '',
        })
        const userpage_url = computed(() => {
            return '../' + data.username;
        })
        let delete_able = ref(false);
        let hasloaded = ref(false);
        function deletepost(event) {
            delete_able.value = true;
            NProgress.start();
            NProgress.set(0.4);
            axios.get(`api/deletepost/${asset_id}`, { params: { public_id: data.public_id } })
                .then((res) => {
                    NProgress.done()
                    return window.location.replace(`../${res.data.username}`)
                })
        }
        onBeforeMount(() => {
            axios.get(`api/callpost/${asset_id}`)
                .then((res) => {
                    data.username = res.data.result.user_name
                    data.postavater = res.data.postavater
                    data.imagepath = res.data.result.image_path
                    data.postintro = res.data.result.postintro
                    data.postdate = res.data.result.postdate
                    data.public_id = res.data.result.public_id
                    hasloaded.value = true;
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        return { data, userpage_url, deletepost,delete_able,hasloaded };
    },
})
app.mount('#v_os')

