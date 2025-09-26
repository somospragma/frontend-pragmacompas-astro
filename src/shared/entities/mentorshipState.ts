import { updateTutoringRequestStatus } from "@/infrastructure/services/updateTutoringRequestStatus";
import { createTutoring } from "@/infrastructure/services/createTutoring";
import { useReducer, useState } from "react";
import { MentorshipStatus } from "@/shared/utils/enums/mentorshipStatus";

type ActionTypes = "NEXT" | "PREVIOUS" | "CANCEL";
type Action = { type: ActionTypes | "SET_STATE"; payload?: MentorshipStatus };

export const transitions: Record<MentorshipStatus, Partial<Record<ActionTypes, MentorshipStatus>>> = {
  [MentorshipStatus.PENDING]: {
    NEXT: MentorshipStatus.AVAILABLE,
    CANCEL: MentorshipStatus.CANCELLING,
  },
  [MentorshipStatus.AVAILABLE]: {
    NEXT: MentorshipStatus.CONVERSING,
    CANCEL: MentorshipStatus.CANCELLING,
  },
  [MentorshipStatus.CONVERSING]: {
    NEXT: MentorshipStatus.ASSIGNED,
    PREVIOUS: MentorshipStatus.AVAILABLE,
    CANCEL: MentorshipStatus.CANCELLING,
  },
  [MentorshipStatus.ASSIGNED]: {
    NEXT: MentorshipStatus.COMPLETED,
    CANCEL: MentorshipStatus.CANCELLING,
  },
  [MentorshipStatus.CANCELLING]: {
    NEXT: MentorshipStatus.CANCELLED,
  },
  [MentorshipStatus.COMPLETED]: {},
  [MentorshipStatus.CANCELLED]: {},
  [MentorshipStatus.ACTIVE]: {},
};

const reducer = (state: MentorshipStatus, action: Action): MentorshipStatus => {
  if (action.type === "SET_STATE" && action.payload) {
    return action.payload;
  }

  const nextState = transitions[state]?.[action.type as ActionTypes];
  return nextState ?? state;
};

export const useMentorshipStates = (
  initialState: MentorshipStatus,
  mentorshipId: string,
  tutorId: string,
  finallyCallback: () => void
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const updateState = async (newState: MentorshipStatus) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (state === MentorshipStatus.CONVERSING && newState === MentorshipStatus.ASSIGNED) {
        await createTutoring({
          tutoringRequestId: mentorshipId,
          tutorId,
          objectives: "Objetivos de la tutoría",
        });

        dispatch({ type: "SET_STATE", payload: newState });
        window.location.href = "/history";
        return;
      } else {
        const { data } = await updateTutoringRequestStatus(mentorshipId, { status: newState });

        if (data.requestStatus === MentorshipStatus.CONVERSING) {
          window.open(`https://somos-pragma.slack.com/team/${data.tutee.slackId}`, "_blank");
        }

        dispatch({ type: "SET_STATE", payload: newState });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      if (!(state === MentorshipStatus.CONVERSING && newState === MentorshipStatus.ASSIGNED)) {
        finallyCallback();
      }
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
