function addToDo() {
    const inputField = document.getElementById('new-todo-text');
    const text = inputField.value;

    if (text === '') {
        return;
    }

    const newTodo = document.createElement('li');
    newTodo.classList.add('todo-item');

    const span = document.createElement('span');
    span.textContent = text;

    newTodo.appendChild(span);
    newTodo.addEventListener('click', function () {
        newTodo.classList.toggle('completed');
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Entfernen';

    removeButton.classList.add('remove-button');

    removeButton.addEventListener('click', function (event) {
        event.stopPropagation();
        newTodo.remove();
    });

    newTodo.appendChild(removeButton);
    const todo_list = document.getElementById('todo-list');
    todo_list.appendChild(newTodo);
    inputField.value = '';
}
