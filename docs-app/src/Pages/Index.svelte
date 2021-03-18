<script>
    import { langStore } from '../Store'
</script>

{#if $langStore === 'en'}

<article>
    <h2>Welcome to Svelte Easyroute homepage!</h2>

    <p>Svelte Easyroute is a simple and convenient router for your Svelte projects.</p>

    <p><strong>TL;DR Features:</strong></p>
    <ul>
        <li>
            Config-based router (just like Vue Router)
        </li>
        <li>
            Dynamic route matching
        </li>
        <li>
            Nested routes
        </li>
        <li>
            Lazy route component loading outside the box
        </li>
        <li>
            Programmatic navigation
        </li>
        <li>
            Named routes
        </li>
        <li>
            Named outlets (views)
        </li>
        <li>
            Global and individual navigation hooks
        </li>
        <li>
            Controlling data loading via route metadata
        </li>
        <li>
            Server side rendering (<b>SSR</b>) that is easy to configure <code>v3.0.0+</code>
        </li>
        <li>
            Hash, history and silent modes
        </li>
        <li>
            Svelte + TypeScript support <code>v3.1.1+</code>
        </li>
    </ul>

    <p>Why you should try it?</p>
    <ol>
        <li>
            Well-known syntax.<br>It was inspired by the router for Vue.js, so this router will be understandable to many of you.
        </li>
        <li>
            Still developing. Many features of the router are still ahead. Already now it can be used in projects, and I’m happy to know what will make it better.
        </li>
        <li>
            Community-friendly. Repository cloning and pull requests are welcome! Together we can make the perfect tool for developing on Svelte
        </li>
    </ol>
</article>
{/if}

{#if $langStore === 'ru'}

    <article>
        <h2>Добро пожаловать в документацию Svelte Easyroute!</h2>

        <p>Svelte Easyroute - это простой и удобный роутер для ваших Svelte-проектов.</p>

        <p><strong>TL;DR Возможности:</strong></p>
        <ul>
            <li>
                Config-based роутер (как Vue Router)
            </li>
            <li>
                Динамическое сопоставление маршрутов
            </li>
            <li>
                Вложенные маршруты
            </li>
            <li>
                Ленивая загрузка компонентов маршрута, "из коробки"
            </li>
            <li>
                Программная навигация
            </li>
            <li>
                Именованные маршруты
            </li>
            <li>
                Именованные представления
            </li>
            <li>
                Глобальные и индивидуальные навигационные хуки
            </li>
            <li>
                Управление загрузкой данных через метаданные маршрутов
            </li>
            <li>
                Рендеринг на стороне сервера (<b>SSR</b>), который легко настроить <code>v3.0.0+</code>
            </li>
            <li>
                Режими hash, history и "тихий"
            </li>
            <li>
                Поддержка Svelte + TypeScript <code>v3.1.1+</code>
            </li>
        </ul>

        <p>Почему стоит попробовать?</p>
        <ol>
            <li>
                Хорошо знакомый синтаксис.<br>
                Сделан по образу и подобию роутра для Vue.js, так что этот роутер будет понятен многим из вас.
            </li>
            <li>
                Всё ещё разрабатывается.<br>
                Многие возможности ещё впереди. Уже сейчас его можно использовать в проектах, и я буду рад узнать, что можно сделать лучше.
            </li>
            <li>
                В сообществе.<br>
                Буду рад вашим пулл-реквестам! Вместе мы можем сделать идеальный инструмент для разработки на Svelte.
            </li>
        </ol>
    </article>

{/if}
