import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImgAndText {
  name: string;
  url: string;
}

interface AnimalState {
  textImgPairs: ImgAndText[];
  formValues: ImgAndText;
  editForm: ImgAndText;
  editMode: boolean;
  editindex: number | null;
}

const initialState: AnimalState = {
    textImgPairs: [],
    formValues: { name: '', url: '' },
    editForm: { name: '', url: '' },
    editMode: false,
    editindex: null
  };

const animalSlice = createSlice({
  name: 'animal',
  initialState,
  reducers: {
    setAnimalData: (state, action: PayloadAction<ImgAndText[]>) => {
        state.textImgPairs = action.payload;
      },
      setFormValues: (state, action: PayloadAction<ImgAndText>) => {
        state.formValues = action.payload;
      },
      setEditForm: (state, action: PayloadAction<ImgAndText>) => {
        state.editForm = action.payload;
      },
      setEditMode: (state, action: PayloadAction<boolean>) => {
        state.editMode = action.payload;
      },
      setEdiIndex:(state, action:  PayloadAction<number | null>) => {
        state.editindex = action.payload
      }
  },
});

export const { setAnimalData, setFormValues, setEditForm, setEditMode, setEdiIndex } = animalSlice.actions;
export default animalSlice.reducer;
