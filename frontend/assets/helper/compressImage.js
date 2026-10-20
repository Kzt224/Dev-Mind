import * as ImageManipulator from "expo-image-manipulator";

export const compressImage = async (uri) => {
    const context = ImageManipulator.ImageManipulator.manipulate(uri);

    context.resize({
        width: 1000,
    });

    const imageRef = await context.renderAsync();

    const result = await imageRef.saveAsync({
        compress: 0.75,
        format: ImageManipulator.SaveFormat.JPEG,
    });
    return result.uri;
};