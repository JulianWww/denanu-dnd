import { toast } from 'react-toastify';
import { Header, Button, Grid } from "semantic-ui-react"


export function printAlert(txt: string) {
  toast(txt);
}

export function AttackRoll(roll: number, crit: () => void, hit: () => void) {
  const close = () => {
    toast.dismiss(toastid);
  }

  const toastid = toast(<>
    <Header> Attack Roll</Header>
    roll is a: {roll}
    <Button.Group fluid>
      <Button color="green" onClick={()=>{close(); crit()}}>
        Crit
      </Button>
      <Button.Or/>
      <Button onClick={()=> {close(); hit()}}>
        Hit
      </Button>
      <Button.Or/>
      <Button color="red" onClick={close}>
        Miss
      </Button>
    </Button.Group>
  </>, {
    autoClose: false,
    closeOnClick: false
  });
}

export function DamageToast(damage: number, type: string) {
  toast.warn(<>
    <Header>Damage</Header>
    <Grid className="bound">
      <Grid.Row>
        <Grid.Column width={8}>
          <b>Damage:</b>
        </Grid.Column>
        <Grid.Column width={8}>
          {damage}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <b>Type:</b>
        </Grid.Column>
        <Grid.Column width={8}>
          {type}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </>, {
    autoClose: 20000
  })
}

export function TargetSaveToast(dc: number, type: string, success: () => void, fail: () => void) {
  const close = () => {
    toast.dismiss(toastid);
  }
  const toastid = toast.warn(<>
    <Header>Target makes a {type} save</Header>
    <Grid className="bound">
      <Grid.Row>
        <Grid.Column width={8}>
          <b>DC:</b>
        </Grid.Column>
        <Grid.Column width={8}>
          {dc}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <b>Type:</b>
        </Grid.Column>
        <Grid.Column width={8}>
          {type}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Button.Group>
          <Button color="green" onClick={()=>{close(); success()}}>
            Succeed
          </Button>
          <Button.Or/>
          <Button onClick={()=> {close(); fail()}}>
            Fail
          </Button>
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </>, {
    autoClose: 20000
  })
}

export function SkillToast(skill: String, attr: string, roll: number, mod: number) {
  toast(<>
    <Header>{skill} ({attr})</Header>
    1d20 + {mod} = <b>{roll}</b>
  </>, {
  })
}

export function SaveToast(attr: string, roll: number, mod: number) {
  toast(<>
    <Header>{attr.toUpperCase()} Save</Header>
    1d20 + {mod} = <b>{roll}</b>
  </>, {
  })
}

export function SaveToastAutoFail(attr: string) {
  toast.error(<>
    <Header>{attr.toUpperCase()} Save</Header>
    Automatically fails.
  </>, {
  })
}

export function AbilityToast(attr: string, roll: number, mod: number) {
  toast(<>
    <Header>{attr.toUpperCase()} Save</Header>
    1d20 + {mod} = <b>{roll}</b>
  </>, {
  })
}

export function NoScriptToast() {
  toast.error(
    <>
      <Header>No Script Available</Header>
      Rightclick the text to open the editor.
    </>
  )
}