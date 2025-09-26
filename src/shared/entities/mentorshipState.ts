import { updateTutoringRequestStatus } from "@/infrastructure/services/updateTutoringRequestStatus";
import { createTutoring } from "@/infrastructure/services/createTutoring";
import { useReducer, useState } from "react";

export enum MentorshipState {
  PENDING = "Pendiente",
  AVAILABLE = "Disponible",
  CONVERSING = "Conversando",
  ASSIGNED = "Asignada",
  CANCELLING = "En cancelación",
  COMPLETED = "Finalizada",
  CANCELLED = "Cancelada",
}

type ActionTypes = "NEXT" | "PREVIOUS" | "CANCEL";
type Action = { type: ActionTypes | "SET_STATE"; payload?: MentorshipState };

// Explicit transitions
export const transitions: Record<MentorshipState, Partial<Record<ActionTypes, MentorshipState>>> = {
  [MentorshipState.PENDING]: {
    NEXT: MentorshipState.AVAILABLE,
    CANCEL: MentorshipState.CANCELLING,
  },
  [MentorshipState.AVAILABLE]: {
    NEXT: MentorshipState.CONVERSING,
    CANCEL: MentorshipState.CANCELLING,
  },
  [MentorshipState.CONVERSING]: {
    NEXT: MentorshipState.ASSIGNED,
    PREVIOUS: MentorshipState.AVAILABLE,
    CANCEL: MentorshipState.CANCELLING,
  },
  [MentorshipState.ASSIGNED]: {
    NEXT: MentorshipState.COMPLETED,
    CANCEL: MentorshipState.CANCELLING,
  },
  [MentorshipState.CANCELLING]: {
    NEXT: MentorshipState.CANCELLED,
  },
  [MentorshipState.COMPLETED]: {},
  [MentorshipState.CANCELLED]: {},
};

const reducer = (state: MentorshipState, action: Action): MentorshipState => {
  if (action.type === "SET_STATE" && action.payload) {
    return action.payload;
  }

  const nextState = transitions[state]?.[action.type as ActionTypes];
  return nextState ?? state; // if invalid transition → stay in current state
};

export const useMentorshipStates = (
  initialState: MentorshipState,
  mentorshipId: string,
  tutorId: string,
  finallyCallback: () => void
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const updateState = async (newState: MentorshipState) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (state === MentorshipState.CONVERSING && newState === MentorshipState.ASSIGNED) {
        await createTutoring({
          tutoringRequestId: mentorshipId,
          tutorId,
          objectives: "Objetivos de la tutoría",
        });

        return;
      }

      const { data } = await updateTutoringRequestStatus(mentorshipId, { status: newState });

      if (data.requestStatus === MentorshipState.CONVERSING) {
        window.open(`https://somos-pragma.slack.com/team/${data.tutee.slackId}`, "_blank");
      }

      // Only update local state after successful API call
      dispatch({ type: "SET_STATE", payload: newState });
    } catch (error) {
      console.error(error);
      // Optionally show error to user
    } finally {
      setIsLoading(false);
      finallyCallback();
    }
  };

  const next = () => {
    const nextState = transitions[state]?.["NEXT"];
    if (nextState) {
      updateState(nextState);
    }
  };

  const previous = () => {
    const previousState = transitions[state]?.["PREVIOUS"];
    if (previousState) {
      updateState(previousState);
    }
  };

  const cancel = () => {
    const cancelState = transitions[state]?.["CANCEL"];
    if (cancelState) {
      updateState(cancelState);
    }
  };

  return { state, next, previous, cancel, isLoading };
};
