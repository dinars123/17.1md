import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Redux/Store';
import {
  setAnimalData,
  setFormValues,
  setEditForm,
  setEditMode,
  setEdiIndex,
} from './Redux/aninmalSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();

  type ImgAndText = {
    name: string;
    url: string;
  };
  const textImgPairs = useSelector(
    (state: RootState) => state.animal.textImgPairs
  );
  const formValues = useSelector((state: RootState) => state.animal.formValues);
  const editForm = useSelector((state: RootState) => state.animal.editForm);
  const editMode = useSelector((state: RootState) => state.animal.editMode);
  const editindex = useSelector((state: RootState) => state.animal.editindex);
  const storedDataString = localStorage.getItem('textImgPairs');
  const storedData: ImgAndText[] = storedDataString
    ? JSON.parse(storedDataString)
    : [];

  useEffect(() => {
    dispatch(setAnimalData(storedData));
  }, []);

  console.log(storedData);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataURL = event.target?.result as string;
        dispatch(setFormValues({ ...formValues, url: dataURL }));
      };
      console.log('editform', formValues);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataURL = event.target?.result as string;
        dispatch(setEditForm({ ...editForm, url: dataURL }));
        console.log('editform', editForm);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="container">
      <form className="mainForm">
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={formValues.name}
          onChange={(e) =>
            dispatch(setFormValues({ ...formValues, name: e.target.value }))
          }
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setAnimalData([...textImgPairs, formValues] as ImgAndText[])
            );
            dispatch(setFormValues({ name: '', url: '' }));
            localStorage.setItem(
              'textImgPairs',
              JSON.stringify([...textImgPairs, formValues])
            );
          }}
        >
          submit
        </button>
      </form>
      <button
        onClick={() => {
          const ascSorted = [...textImgPairs].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          dispatch(setAnimalData(ascSorted));
          localStorage.setItem('textImgPairs', JSON.stringify(ascSorted));
        }}
      >
        asc
      </button>
      <button
        onClick={() => {
          const dsecSorted = [...textImgPairs].sort((a, b) =>
            b.name.localeCompare(a.name)
          );
          dispatch(setAnimalData(dsecSorted));
          localStorage.setItem('textImgPairs', JSON.stringify(dsecSorted));
        }}
      >
        dsec
      </button>
      {textImgPairs.length === 0 ? (
        <p>no animals added</p>
      ) : (
        <div className="animalCardWrapper">
          {textImgPairs.map((pair, index) => (
            <div className="cardAndEditWrap">
              <div className="animalCard" key={index}>
                <div className='topPart'>
                  <img
                    className="cardsImage"
                    src={pair.url}
                    alt={`Image for ${pair.name}`}
                  />
                  <h2 className="animalName">{pair.name}</h2>
                </div>

                <div className="buttonWrapper">
                  <button
                    className="button"
                    onClick={() => {
                      const newArr = textImgPairs.filter((_, i) => i !== index);
                      dispatch(setAnimalData(newArr));
                      localStorage.setItem(
                        'textImgPairs',
                        JSON.stringify(newArr)
                      );
                    }}
                  >
                    delete
                  </button>
                  <button
                    className="button"
                    onClick={() => {
                      dispatch(setEditForm(textImgPairs[index]));
                      dispatch(setEditMode(true));
                      dispatch(setEdiIndex(index));
                    }}
                  >
                    edit
                  </button>
                </div>
              </div>

              {editMode && editindex === index && (
                <div className="editpart">
                  <form className="editForm">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleFileChangeEdit}
                    />
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        dispatch(
                          setEditForm({ ...editForm, name: e.target.value })
                        )
                      }
                    />
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        const coppiedArr = [...textImgPairs];
                        coppiedArr[index] = {
                          name: editForm.name,
                          url: editForm.url,
                        };
                        dispatch(setAnimalData(coppiedArr));
                        localStorage.setItem(
                          'textImgPairs',
                          JSON.stringify(coppiedArr)
                        );
                        dispatch(setEditForm({ name: '', url: '' }));
                        dispatch(setEditMode(false));
                      }}
                    >
                      save
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setEditMode(false));
                        dispatch(setEditForm({ name: '', url: '' }));
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
