const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

class DOMControls
{
	static setInfoTodoPage(items) {
		DOMControls.setListOfTodos(items);

		DOMControls.setTextToObject(
			itemCountSpan,
			items.length
		);

		DOMControls.setTextToObject(
			uncheckedCountSpan,
			items.filter(item => !item.check).length
		);
	}

	static setTextToObject(object, text) {
		object.innerHTML = text;
	}

	static setListOfTodos(items) {
		list.innerHTML = '';
		items.forEach(DOMControls.setTodoItem);
	}

	static setTodoItem(item) {
		let div = document.createElement("div");
		div.classList.add(classNames.TODO_ITEM);
		div.setAttribute('data-id', item.id);

		let checkBox = document.createElement("input");
		checkBox.classList.add(classNames.TODO_CHECKBOX);
		checkBox.setAttribute('type', 'checkbox');
		checkBox.addEventListener('change', TodoTriggers.checkChangeTodo);

		if (item.check) {
			checkBox.setAttribute('checked', 'checked');
		}

		let span = document.createElement("span");
		span.classList.add(classNames.TODO_TEXT);
		span.textContent = item.title;

		let buttonDelete = document.createElement("button");
		buttonDelete.classList.add(classNames.TODO_DELETE);
		buttonDelete.addEventListener('click', TodoTriggers.deleteTodo);
		buttonDelete.textContent = 'delete';

		div.append(checkBox, span, buttonDelete);

		list.append(div);
	}
}

class Todos
{
	#items = null;
	#maxId = 1;

	get items() { return this.#items; }
	set item(value) {
		let todos = this.items;
		todos.push(value);
		this.items = todos;
	}
	set items(value) {
		this.#items = value;
		localStorage.setItem('todos-items', JSON.stringify(value));
		this.updateItemsInfo();
	}

	constructor() {
		this.firstSetTodos();
	}

	firstSetTodos() {
		try {
			let todos = localStorage.getItem('todos-items');
			this.items = JSON.parse(todos);
		} catch (error) {
			this.items = new Array(0);
		}

		try {
			this.#maxId = this.items[this.items.length - 1].id;
		} catch (error) {
			this.#maxId = 1;
		}
	}
	insertTodo() {
		let title = prompt('Title: ');

		this.item = {
			id: ++this.#maxId,
			title: title,
			check: false
		}
	}

	updateItemsInfo() {
		DOMControls.setInfoTodoPage(this.items);
	}
}

class TodoTriggers
{
	/*trigger function. this is object trigger*/
	static deleteTodo(el) {
		let todoId = TodoTriggers.getItemIdByChildElement(el.target),
			indexTodo = todoManager.items.findIndex(item => item.id == todoId),
			todos = todoManager.items;

		todos.splice(indexTodo, 1);

		todoManager.items = todos;
	}
	/*trigger function. this is object trigger*/
	static checkChangeTodo(el) {
		let todoId = TodoTriggers.getItemIdByChildElement(el.target);

		todoManager.items = todoManager.items.map((item) => {
			return {
				...item,
				check: item.id == todoId ? !item.check : item.check
			};
		});
	}
	/*trigger function. this is object trigger*/
	static insertTodo() {
		todoManager.insertTodo();
	}

	static getItemIdByChildElement(childElement) {
		let stringId = childElement.parentElement.getAttribute('data-id');
		return parseInt(stringId);
	}
}

var todoManager = new Todos();