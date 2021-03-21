* Профиль
* Админ `admin`
    * Организации (CRUD) `orgs` - уже есть
    * Пользователи (CRUD) `users` - уже есть
    * Связь организации - пользователи (CRUD) `relations` - уже есть
* Связанные учебные заведения - уже есть
* Учебное заведение - уже есть
    * Пользователи (CRUD) - контроля прав нет
        * src/graphql/examples/streams/users/list.graphql  (learningStreamId не обязателен)
        * остальное как у суперпользователя
    * Потоки (CRUD) `streams`
        * src/graphql/examples/streams/create.graphql
        * src/graphql/examples/streams/delete.graphql
        * src/graphql/examples/streams/list.graphql
        * src/graphql/examples/streams/read.graphql
        * src/graphql/examples/streams/update.graphql
    * Связь пользователи - потоки
        * src/graphql/examples/streams/users/linkLeader.graphql
        * src/graphql/examples/streams/users/linkStudent.graphql
        * src/graphql/examples/streams/users/unlinkLeader.graphql
        * src/graphql/examples/streams/users/unlinkStudent.graphql
    * Поток `src/graphql/examples/streams/list.graphql`
        * src/graphql/examples/streams/users/list.graphql  (обязавтелен learningStreamId)
        * остальное как у суперпользователя
