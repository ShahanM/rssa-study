import {render, screen} from "@testing-library/react";

import StudyLayoutTwo from "./StudyLayoutTwo";


describe("StudyLayoutTwo", () => {
	test("Renders with 5 MovieGallery elements.", () => {
		render(<StudyLayoutTwo />);
		const galleryElements = screen.queryAllByTestId("gallery-container");
		expect(galleryElements.length).toBe(3);
	});
});

