Vue.component('footer_app', {
    template: `<footer>
<a href="http://eternaltree.com.ua" target="_blank">Vitalii Bahrynets\`s Personal WebPage<span
                class="year"> 2020</span></a>
</footer>`
});

Vue.component('mode_option', {
    props: ['data'],
    template: ` <a :href="data.link" :class="'mode_option ' + data.classes">{{data.title}}</a>`
});

Vue.component('mode', {
    props: ['mode'],
    template: `<div class="mode">
                    <div class="mode_title title_first">{{mode.title}}</div>
                    <div class="mode_options">
                       <mode_option
                       v-for="item in mode.mode_options"
                       v-bind:data="item"></mode_option>
                    </div>
                </div>`
});



var app = new Vue({
    el: '#app',
    data: {
        app_name: 'Изучаем английские слова',
        modes: [
            {
                title: 'Выбери правильный перевод',
                mode_options: [
                    {
                        title: `с Английского на Русский`,
                        classes: 'russian',
                        link: 'translate.html?mode=1&to=russian'
                    },
                    {
                        title: `с Русского на Английский`,
                        classes: '',
                        link: 'translate.html?mode=1&to=english'
                    },
                ]
            },
            {
                title: 'Напечатай правильно слово',
                mode_options: [
                    {
                        title: 'с Русского на Английский',
                        classes: '',
                        link: 'typing.html?mode=2&to=russian'
                    }
                ]
            }
        ]
    }
});


