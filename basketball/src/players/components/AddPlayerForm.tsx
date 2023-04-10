import React, { useState } from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoadingButton from '@mui/lab/LoadingButton';
import {
  DatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Player } from '../../types';

interface AddPlayerFormProps {
  open: boolean,
  isLoading:boolean,
  onSubmit: (data: Record<string,Omit<Player, "player_id">>) => void,
  onCancel: () => void,
}
 function AddPlayerForm({ open, onSubmit, onCancel, isLoading }: AddPlayerFormProps) {
  const today =new Date();
  const [name, setName] = useState("");
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [college, setCollege] = useState("");
  const [born, setBorn] = useState(today);
  const [birthCity, setBirthCity] = useState("");
  const [birthState, setBirthState] = useState("");
  const [yearStart, setYearStart] = useState<Date | null>(today);
  const [yearEnd, setYearEnd] = useState<Date | null>(today);
  const [position, setPosition] = useState("");
  const [weight, setWeight] = useState(0);
  const [birthDate, setBirthDate] = useState(today);

  const onFormSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const player = { name, height, width, college, born:born?.getFullYear() ?? null, birth_city: birthCity, birth_state: birthState, year_start: yearStart?.getFullYear() ?? null, year_end: yearEnd?.getFullYear() ?? null, position, weight, birth_date: birthDate }
    onSubmit({player});
    resetForm()
  }
  const onFormCancel = () =>{
    resetForm()
    onCancel()
  }
  const resetForm = () =>{
    setName("");
    setHeight(0);
    setWeight(0);
    setWidth(0)
    setCollege("")
    setBorn(today)
    setBirthCity("")
    setBirthState("")
    setYearStart(today)
    setYearEnd(today)
    setPosition("")
    setBirthDate(today)
  }
  return (
    <Dialog
      open={open}
      onClose={onFormCancel}
    >
        <form className="p-4"  onSubmit={onFormSubmit}>
      <DialogTitle id="add-form-title">Add Player</DialogTitle>
      <DialogContent  style={{ height: "400px" }}>
          <TextField margin={'normal'}  id="name" label="Name" value={name} onChange={(event)=>setName(event.target.value)} type="text" fullWidth />
          <TextField id="height" label="Height" type="number" value={height} onChange={(event)=>setHeight(Number.parseInt(event.target.value))}  fullWidth margin={'normal'}  />
          <TextField id="weight" label="Weight" type="number" value={weight} onChange={(event)=>setWeight(Number.parseInt(event.target.value))} fullWidth margin={'normal'} />
          <TextField id="width" label="Width" type="number" value={width} onChange={(event)=>setWidth(Number.parseInt(event.target.value))} fullWidth margin={'normal'} />
          <TextField id="college" label="College" type="text"  value={college} onChange={(event)=>setCollege(event.target.value)} fullWidth margin={'normal'} />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker id="born"  label="Born" value={born} onChange={date => date && setBorn(date)} views={['year']} fullWidth margin={'normal'} /> 
            <DatePicker id="year-start" label="Year Start" value={yearStart} onChange={date => date && setYearStart(date)} fullWidth views={['year']} margin={'normal'} />
            <DatePicker id="year-end" label="Year End" value={yearEnd} onChange={date => date && setYearEnd(date)} fullWidth views={['year']} margin={'normal'} />
            <DatePicker id="birth-date" label="Birth Date" value={birthDate}  placeholder="MM/DD/YYYY" format={"MM/dd/yyyy"} maxDate={today.setDate(today.getDate() - 1)} onChange={date => date && setBirthDate  (date)} fullWidth margin={'normal'} />
          </MuiPickersUtilsProvider>
          <TextField id="birth-city" label="Birth City" type="text" value={birthCity}  onChange={(event)=>setBirthCity(event.target.value)} fullWidth margin={'normal'} />
          <TextField id="birth-state" label="Birth State" type="text" value={birthState}  onChange={(event)=>setBirthState(event.target.value)}  fullWidth margin={'normal'} />
          <TextField id="position" label="Position" type="text" value={position}  onChange={(event)=>setPosition(event.target.value)} fullWidth margin={'normal'} />
      </DialogContent>
      <DialogActions >
        <Button onClick={onFormCancel} color="secondary">
          Cancel
        </Button>
        <LoadingButton type="submit" color="primary" loading={isLoading}>
          Submit
        </LoadingButton>
      </DialogActions>
        </form>
    </Dialog>
  );
}

export default React.memo(AddPlayerForm);