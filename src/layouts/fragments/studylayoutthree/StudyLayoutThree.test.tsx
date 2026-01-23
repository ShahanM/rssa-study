import {render, screen} from "@testing-library/react";

import StudyLayoutThree from "./StudyLayoutThree";


describe("StudyLayoutThree", () => {
	test("Renders with 3 MovieGallery elements.", () => {
		render(<StudyLayoutThree />);
		const galleryElements = screen.queryAllByTestId("gallery-container");
		expect(galleryElements.length).toBe(5);
	});
});