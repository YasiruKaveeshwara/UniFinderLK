import React from "react";
import {
	PhysicalScienceIcon,
	BiologicalScienceIcon,
	CommerceStreamIcon,
	EngineeringTechIcon,
	BioSystemsTechIcon,
	ArtsStreamIcon,
} from "../ui/Icons";

/** Map of icon key → component */
const ICON_MAP = {
	atom: PhysicalScienceIcon,
	biology: BiologicalScienceIcon,
	commerce: CommerceStreamIcon,
	engineering: EngineeringTechIcon,
	biosystems: BioSystemsTechIcon,
	arts: ArtsStreamIcon,
};

export function StreamIcon({ iconKey, className }) {
	const Icon = ICON_MAP[iconKey] || PhysicalScienceIcon;
	return <Icon className={className} />;
}
