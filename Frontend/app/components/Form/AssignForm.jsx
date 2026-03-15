import { useModalStore } from "@/assets/store/modalStore";
import { useState } from "react";
import DropDown from "@/app/components/card/items/dropDown.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../card/loading";
import { getProjectById } from "@/assets/api/fetchData.js";

export default function AssignForm({ projectList }) {
    const { inputData, setInputData } = useModalStore();

    const projectId = Number(inputData["Project Id"]);
    const { data, isLoading } = useQuery({
        queryKey: ['projectDetail', projectId],
        queryFn: () => getProjectById(projectId),
        enabled: !!projectId,
    });
    const [activeDropdown, setActiveDropdown] = useState(null);
    if (isLoading) {
        return (
            <Loading />
        );
    }
    //initialize project task
    const projectTasks = data?.result;
    //filter project's task are not done 
    const taskList = projectTasks?.tasks?.filter((t) => t.status !== "DONE");
    return (
        <>
            <DropDown
                placeholder="Project Name"
                value={inputData["Project Name"]}
                data={projectList}
                visible={activeDropdown === "project"}
                onToggle={() =>
                    setActiveDropdown(activeDropdown === "project" ? null : "project")
                }
                onSelect={(item) => {
                    setInputData("Project Name", item.name);
                    setInputData("Project Id", item.id);
                    setActiveDropdown(null);
                }}
            />
            {inputData['Project Id'] && (
                <DropDown
                    placeholder="Task Name"
                    value={inputData["task Name"]}
                    data={taskList}
                    visible={activeDropdown === "task"}
                    onToggle={() =>
                        setActiveDropdown(activeDropdown === "task" ? null : "task")
                    }
                    onSelect={(item) => {
                        setInputData("task Name", item.name);
                        setInputData("task Id",item.id);
                        setActiveDropdown(null);
                    }}
                />
            )}

        </>
    );
}

