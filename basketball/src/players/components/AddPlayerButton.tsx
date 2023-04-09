import Button from '@material-ui/core/Button';
interface AddPlayerButtonProps {
  onClick: () => void
}

export function AddPlayerButton({ onClick }: AddPlayerButtonProps) {
  return (
    <Button variant="contained" color="primary"  onClick={onClick}>
    Add Player
  </Button>
  );
}
