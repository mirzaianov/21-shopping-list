import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { uid } from 'uid';
import { set, ref, onValue, remove, update } from 'firebase/database';
import {
  LuPenSquare,
  LuCheckCircle,
  LuTrash2,
  LuLogOut,
  LuSmile,
  LuPlusCircle,
} from 'react-icons/lu';
import { auth, db } from '../../firebase';

const style = {
  container: `bg-base-100 max-w-[358px] text-center w-full m-auto border-solid border border-neutral rounded-2xl p-5 text-lg text-base-content`,
  sign: `font-mono flex justify-between rounded-lg`,
  email: `font-bold cursor-default self-center text-base`,
  heading: `text-2xl font-bold text-center p-5 uppercase`,
  form: `flex justify-between mb-3`,
  input: `input w-full input-bordered border-neutral placeholder:text-lg text-lg focus:input-primary`,
  addButton: `ml-5 text-primary`,
  confirmButton: `ml-5 text-primary`,
  signOutButton: ``,
  signInLogo: `cursor-default`,
  todos: `[&>*:last-child]:border-0 [&>*:last-child]:pb-0`,
  todo: `flex py-2 gap-x-3 border-solid border-b border-neutral`,
  todoName: `mr-auto self-center text-left`,
  updateButton: `ml-1`,
  deleteButton: ``,
  count: `text-center mt-5`,
  size: `font-bold text-xl`,
};

const buttonSmall = 25;
const buttonBig = 40;

export default function Homepage() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  const addRef = useRef();
  const editRef = useRef();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read form firebase
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);

          const data = snapshot.val();

          if (data !== null) {
            Object.values(data).map((item) => {
              setTodos((oldArray) => [...oldArray, item]);
            });
          }
        });

        const { email } = user;
        setUserEmail(email);
      }

      if (!user) {
        navigate('/');
      }
    });
  }, []);

  useEffect(() => {
    isEdit ? editRef.current.focus() : addRef.current.focus();
  }, [isEdit]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleInputChange = (e) => {
    setTodo(e.target.value);
  };

  const handleInputBlur = () => {
    setTodo(todo.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTodo(e.target.value.trim());
    }
  };

  // add to fiewbase
  const writeToDatabase = (e) => {
    e.preventDefault();

    // console.log(`#${todo}#`);

    if (todo.length === 0 || todo.trim().length === 0) {
      setTodo('');
      return alert('Please enter a todo');
    }

    if (
      todos.find(
        (item) => item.todo.toLowerCase().trim() === todo.toLowerCase().trim(),
      )
    ) {
      return alert('Todo already exists');
    }

    const uidd = uid();

    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), { todo, uidd });
    setTodo('');
  };

  // update in firebase
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = (e) => {
    e.preventDefault();
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), { todo, tempUidd });
    setTodo('');
    setIsEdit(false);
  };

  // delete from firebase
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.sign}>
          <button
            className={style.signInLogo}
            title="You are signed in"
          >
            <LuSmile size={buttonSmall} />
          </button>
          <span
            className={style.email}
            title="Your email"
          >
            {userEmail}
          </span>
          <button
            className={style.signOutButton}
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LuLogOut size={buttonSmall} />
          </button>
        </div>
        <h1 className={style.heading}>
          Shopping List{' • '}
          {todos.length === 0 ? <span>0</span> : <span>{todos.length}</span>}
        </h1>
        <form className={style.form}>
          {isEdit ? (
            <>
              <input
                className={style.input}
                type="text"
                placeholder="Edit the item"
                value={todo}
                ref={editRef}
                onChange={handleInputChange}
              />
              <button
                className={style.confirmButton}
                onClick={handleEditConfirm}
                title="Confirm the changes"
              >
                <LuCheckCircle size={buttonBig} />
              </button>
            </>
          ) : (
            <>
              <input
                className={style.input}
                type="text"
                placeholder="Add a new item"
                value={todo}
                ref={addRef}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
              />
              <button
                className={style.addButton}
                onClick={writeToDatabase}
                title="Add an item to the list"
              >
                <LuPlusCircle size={buttonBig} />
              </button>
            </>
          )}
        </form>
        <ul className={style.todos}>
          {todos.map((item) => (
            <li
              className={style.todo}
              key={item.uidd}
            >
              <h3 className={style.todoName}>{item.todo}</h3>
              <button
                className={style.updateButton}
                onClick={() => handleUpdate(item)}
              >
                <LuPenSquare size={buttonSmall} />
              </button>
              <button
                className={style.deleteButton}
                onClick={() => handleDelete(item.uidd)}
              >
                <LuTrash2 size={buttonSmall} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
