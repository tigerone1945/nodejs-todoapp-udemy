console.log('script.js が読み込まれました');
console.log('axios:', axios);

// DOM要素を取得
const taskDOM = document.querySelector('.tasks');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
// IDセレクターとクラスセレクターの両方を試す
const formAlertDOM = document.getElementById('form-alert') || document.querySelector('.form-alert');

console.log('DOM要素の確認:');
console.log('taskDOM:', taskDOM);
console.log('formDOM:', formDOM);
console.log('taskInputDOM:', taskInputDOM);
console.log('formAlertDOM:', formAlertDOM);

// /api/v1/tasksからタスクを読み込む
const showTasks = async () => {
    try {
        // 自作のAPIを叩く
        const {data: tasks} = await axios.get('/api/v1/tasks');

        console.log('取得したデータ:', tasks);
        console.log('allTasksの中身:', tasks.allTasks);
        console.log('タスクの数:', tasks.allTasks?.length);

        // タスクが一つもない時
        if (!tasks.allTasks || tasks.allTasks.length === 0) {
            console.log('タスクがないため、空のメッセージを表示します');
            taskDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`;
            return;
        }

        // console.log(tasks);

        // タスクを表示する（tasks.allTasksが実際の配列）
        const allTasks = tasks.allTasks.map((task) => {
            const {_id, name, completed} = task;
            // 完了状態に応じてクラスを追加
            const taskClass = completed ? 'single-task task-completed' : 'single-task';
            return `<div class="${taskClass}">
                <h5>
                    <span><i class="far fa-check-circle"></i></span>${name}
                </h5>
                <div class="task-links">
                    <!-- 編集リンク -->
                    <a href="edit.html?id=${_id}" class="edit-link">
                        <i class="fas fa-edit"></i>
                    </a>
                    <!-- ゴミ箱リンク -->
                    <button type="button" class="delete-btn" data-id="${_id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        })
        .join('');
        taskDOM.innerHTML = allTasks;
   } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

showTasks();

// タスクを新規作成する
formDOM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = taskInputDOM.value.trim();

    // 入力値の検証
    if (!name) {
        if (formAlertDOM) {
            formAlertDOM.style.display = 'block';
            formAlertDOM.innerHTML = 'エラー: タスク名を入力してください';
            formAlertDOM.classList.remove('text-success');
            formAlertDOM.classList.add('text-error');
        }
        return;
    }

    if (name.length > 20) {
        if (formAlertDOM) {
            formAlertDOM.style.display = 'block';
            formAlertDOM.innerHTML = 'エラー: タスク名は20文字以内で入力してください';
            formAlertDOM.classList.remove('text-success');
            formAlertDOM.classList.add('text-error');
            setTimeout(() => {
                formAlertDOM.style.display = 'none';
                formAlertDOM.classList.remove('text-error');
            }, 3000);
        }
        return;
    }

    try {
        console.log('送信するデータ:', { name: name });
        await axios.post('/api/v1/tasks', { name: name });
        showTasks();
        taskInputDOM.value = '';
        
        if (formAlertDOM) {
            console.log('成功メッセージを表示します');
            formAlertDOM.style.display = 'block';
            formAlertDOM.style.visibility = 'visible';
            formAlertDOM.style.opacity = '1';
            formAlertDOM.textContent = 'タスクが作成されました';
            formAlertDOM.classList.remove('text-error');
            formAlertDOM.classList.add('text-success');
            console.log('formAlertDOM の内容:', formAlertDOM.textContent);
            console.log('formAlertDOM のスタイル:', formAlertDOM.style.display);
            
            // 3秒後に成功メッセージを非表示にする
            setTimeout(() => {
                formAlertDOM.style.display = 'none';
                formAlertDOM.classList.remove('text-success');
                console.log('成功メッセージを非表示にしました');
            }, 3000);
        }
    } catch (error) {
        console.error('Error creating task:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.message || 'タスクの作成に失敗しました';
        if (formAlertDOM) {
            formAlertDOM.style.display = 'block';
            formAlertDOM.innerHTML = `エラー: ${errorMessage}`;
            formAlertDOM.classList.remove('text-success');
            formAlertDOM.classList.add('text-error');
        } else {
            console.error('formAlertDOM が見つかりません');
        }
    }
});

// タスクの編集と削除を処理する
taskDOM.addEventListener('click', async (event) => {
    console.log('Click detected on:', event.target);
    console.log('Target classes:', event.target.classList);
    console.log('Target tagName:', event.target.tagName);
    
    // 編集リンクがクリックされた場合
    let editLink = event.target;
    if (event.target.tagName === 'I' && event.target.closest('.edit-link')) {
        editLink = event.target.closest('.edit-link');
    }
    
    if (editLink.classList.contains('edit-link')) {
        console.log('編集リンクがクリックされました');
        // デフォルトのリンク動作を許可（edit.html?id=xxxに移動）
        return;
    }
    
    // アイコンがクリックされた場合は親のボタンを取得
    let deleteBtn = event.target;
    if (event.target.tagName === 'I' && event.target.closest('.delete-btn')) {
        deleteBtn = event.target.closest('.delete-btn');
        console.log('Found parent delete button:', deleteBtn);
    }
    
    if (deleteBtn.classList.contains('delete-btn')) {
        const taskId = deleteBtn.dataset.id;
        console.log('Deleting task with ID:', taskId);

        try {
            const response = await axios.delete(`/api/v1/tasks/${taskId}`);
            console.log('Delete response:', response);
            console.log('Delete successful, refreshing tasks...');
            showTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            console.error('Error details:', error.response?.data);
        }
    }
});
