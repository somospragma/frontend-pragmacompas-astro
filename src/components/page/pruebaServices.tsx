import React, { useState } from "react";
import { getTutoringRequests } from "../../infrastructure/services/getTutoringRequests";
import { updateTutoringRequestStatus } from "../../infrastructure/services/updateTutoringRequestStatus";
import { createTutoring } from "../../infrastructure/services/createTutoring";
import { completeTutoring } from "../../infrastructure/services/completeTutoring";
import { cancelTutoring } from "../../infrastructure/services/cancelTutoring";
import { updateUser } from "../../infrastructure/services/updateUser";
import { getUserById } from "../../infrastructure/services/getUserById";
import { updateUserRole } from "../../infrastructure/services/updateUserRole";
import { updateTutoringLimit } from "../../infrastructure/services/updateTutoringLimit";
import { postCreateChapter } from "../../infrastructure/services/postCreateChapter";
import { getFindChapter } from "../../infrastructure/services/getFindChapter";
import { updateSkill } from "../../infrastructure/services/updateSkill";
import { deleteSkill } from "../../infrastructure/services/deleteSkill";
import { MentorshipState } from "@/shared/entities/mentorshipState";

const PruebaServices: React.FC = () => {
  const [result, setResult] = useState<unknown>(null);

  const handleGetTutoringRequests = async () => {
    const res = await getTutoringRequests({});
    setResult(res);
  };

  const handleUpdateTutoringRequestStatus = async () => {
    const res = await updateTutoringRequestStatus("requestId", { status: MentorshipState.AVAILABLE });
    setResult(res);
  };

  const handleCreateTutoring = async () => {
    const res = await createTutoring({
      tutoringRequestId: "requestId",
      tutorId: "tutorId",
      objectives: "Objetivos de prueba",
    });
    setResult(res);
  };

  const handleCompleteTutoring = async () => {
    const res = await completeTutoring("tutoringId", { userId: "userId", comments: "Comentarios" });
    setResult(res);
  };

  const handleCancelTutoring = async () => {
    const res = await cancelTutoring("tutoringId", { userId: "userId", comments: "Comentarios" });
    setResult(res);
  };

  const handleUpdateUser = async () => {
    const res = await updateUser({ id: "userId", firstName: "Nuevo", lastName: "Nombre", chapterId: "chapterId" });
    setResult(res);
  };

  const handleGetUserById = async () => {
    const res = await getUserById("userId");
    setResult(res);
  };

  const handleUpdateUserRole = async () => {
    const res = await updateUserRole({ id: "userId", role: "Tutor" });
    setResult(res);
  };

  const handleUpdateTutoringLimit = async () => {
    const res = await updateTutoringLimit({ id: "userId", activeTutoringLimit: 5 });
    setResult(res);
  };

  const handlePostCreateChapter = async () => {
    const res = await postCreateChapter({ name: "Nuevo Chapter" });
    setResult(res);
  };

  const handleGetFindChapter = async () => {
    const res = await getFindChapter("backend");
    setResult(res);
  };

  const handleUpdateSkill = async () => {
    const res = await updateSkill({ id: "skillId", name: "Nueva Habilidad" });
    setResult(res);
  };

  const handleDeleteSkill = async () => {
    await deleteSkill("skillId");
    setResult("Skill eliminada");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button onClick={handleGetTutoringRequests}>Get Tutoring Requests</button>
      <button onClick={handleUpdateTutoringRequestStatus}>Update Tutoring Request Status</button>
      <button onClick={handleCreateTutoring}>Create Tutoring</button>
      <button onClick={handleCompleteTutoring}>Complete Tutoring</button>
      <button onClick={handleCancelTutoring}>Cancel Tutoring</button>
      <button onClick={handleUpdateUser}>Update User</button>
      <button onClick={handleGetUserById}>Get User By Id</button>
      <button onClick={handleUpdateUserRole}>Update User Role</button>
      <button onClick={handleUpdateTutoringLimit}>Update Tutoring Limit</button>
      <button onClick={handlePostCreateChapter}>Create Chapter</button>
      <button onClick={handleGetFindChapter}>Get Chapter By Id</button>
      <button onClick={handleUpdateSkill}>Update Skill</button>
      <button onClick={handleDeleteSkill}>Delete Skill</button>
      {typeof result === "object" || typeof result === "string" || typeof result === "number" ? (
        <pre style={{ marginTop: 16, background: "#f5f5f5", padding: 12, borderRadius: 6 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
};

export default PruebaServices;
