import { Color3 } from "@babylonjs/core";
import {
  AddBlock,
  AnimatedInputBlockTypes,
  DivideBlock,
  DotBlock,
  FragmentOutputBlock,
  InputBlock,
  LightInformationBlock,
  MaxBlock,
  MultiplyBlock,
  NodeMaterial,
  NodeMaterialSystemValues,
  NormalizeBlock,
  OneMinusBlock,
  Rotate2dBlock,
  ScaleBlock,
  StepBlock,
  Texture,
  TextureBlock,
  TransformBlock,
  VectorMergerBlock,
  VectorSplitterBlock,
  VertexOutputBlock,
  ViewDirectionBlock,
} from "@babylonjs/core/Materials";

export class InkMaterial {
  public static createMaterial() {
    let nodeMaterial = new NodeMaterial("Ink");
    // InputBlock
    var position = new InputBlock("position");
    position.visibleInInspector = false;
    position.visibleOnFrame = false;
    position.target = 1;
    position.setAsAttribute("position");

    // TransformBlock
    var worldPos = new TransformBlock("worldPos");
    worldPos.visibleInInspector = false;
    worldPos.visibleOnFrame = false;
    worldPos.target = 1;
    worldPos.complementZ = 0;
    worldPos.complementW = 1;

    // InputBlock
    var world = new InputBlock("world");
    world.visibleInInspector = false;
    world.visibleOnFrame = false;
    world.target = 1;
    world.setAsSystemValue(NodeMaterialSystemValues.World);

    // TransformBlock
    var Worldnormal = new TransformBlock("World normal");
    Worldnormal.visibleInInspector = false;
    Worldnormal.visibleOnFrame = false;
    Worldnormal.target = 1;
    Worldnormal.complementZ = 0;
    Worldnormal.complementW = 0;

    // InputBlock
    var normal = new InputBlock("normal");
    normal.visibleInInspector = false;
    normal.visibleOnFrame = false;
    normal.target = 1;
    normal.setAsAttribute("normal");

    // VectorSplitterBlock
    var N = new VectorSplitterBlock("N");
    N.visibleInInspector = false;
    N.visibleOnFrame = false;
    N.target = 4;

    // NormalizeBlock
    var NNormalized = new NormalizeBlock("N (Normalized)");
    NNormalized.visibleInInspector = false;
    NNormalized.visibleOnFrame = false;
    NNormalized.target = 4;

    // DotBlock
    var NDotV = new DotBlock("N Dot V");
    NDotV.visibleInInspector = false;
    NDotV.visibleOnFrame = false;
    NDotV.target = 4;

    // NormalizeBlock
    var VNormalized = new NormalizeBlock("V (Normalized)");
    VNormalized.visibleInInspector = false;
    VNormalized.visibleOnFrame = false;
    VNormalized.target = 4;

    // ViewDirectionBlock
    var Viewdirection = new ViewDirectionBlock("View direction");
    Viewdirection.visibleInInspector = false;
    Viewdirection.visibleOnFrame = false;
    Viewdirection.target = 4;

    // InputBlock
    var cameraPosition = new InputBlock("cameraPosition");
    cameraPosition.visibleInInspector = false;
    cameraPosition.visibleOnFrame = false;
    cameraPosition.target = 1;
    cameraPosition.setAsSystemValue(NodeMaterialSystemValues.CameraPosition);

    // AddBlock
    var H = new AddBlock("H");
    H.visibleInInspector = false;
    H.visibleOnFrame = false;
    H.target = 4;

    // NormalizeBlock
    var LNormalized = new NormalizeBlock("L (Normalized)");
    LNormalized.visibleInInspector = false;
    LNormalized.visibleOnFrame = false;
    LNormalized.target = 4;

    // LightInformationBlock
    var Lightinformation = new LightInformationBlock("Light information");
    Lightinformation.visibleInInspector = false;
    Lightinformation.visibleOnFrame = false;
    Lightinformation.target = 1;

    // DotBlock
    var NDotLDiffuseLightIntensity = new DotBlock(
      "N Dot L (Diffuse Light Intensity)"
    );
    NDotLDiffuseLightIntensity.visibleInInspector = false;
    NDotLDiffuseLightIntensity.visibleOnFrame = false;
    NDotLDiffuseLightIntensity.target = 4;

    // StepBlock
    var QuantizedDiffuseLightIntensity = new StepBlock(
      "Quantized Diffuse Light Intensity"
    );
    QuantizedDiffuseLightIntensity.visibleInInspector = false;
    QuantizedDiffuseLightIntensity.visibleOnFrame = false;
    QuantizedDiffuseLightIntensity.target = 4;

    // InputBlock
    var DiffuseBrightCutoff = new InputBlock("Diffuse Bright Cutoff");
    DiffuseBrightCutoff.visibleInInspector = false;
    DiffuseBrightCutoff.visibleOnFrame = false;
    DiffuseBrightCutoff.target = 1;
    DiffuseBrightCutoff.value = 0.8;
    DiffuseBrightCutoff.min = 0;
    DiffuseBrightCutoff.max = 0;
    DiffuseBrightCutoff.isBoolean = false;
    DiffuseBrightCutoff.matrixMode = 0;
    DiffuseBrightCutoff.animationType = AnimatedInputBlockTypes.None;
    DiffuseBrightCutoff.isConstant = false;

    // ScaleBlock
    var Scale = new ScaleBlock("Scale");
    Scale.visibleInInspector = false;
    Scale.visibleOnFrame = false;
    Scale.target = 4;

    // ScaleBlock
    var BrightLightCalculation = new ScaleBlock("Bright Light Calculation");
    BrightLightCalculation.visibleInInspector = false;
    BrightLightCalculation.visibleOnFrame = false;
    BrightLightCalculation.target = 4;

    // InputBlock
    var DiffuseLightColor = new InputBlock("Diffuse Light Color");
    DiffuseLightColor.visibleInInspector = false;
    DiffuseLightColor.visibleOnFrame = false;
    DiffuseLightColor.target = 1;
    DiffuseLightColor.value = new Color3(1, 1, 1);
    DiffuseLightColor.isConstant = false;

    // ScaleBlock
    // Dim Light Color
    var Scale1 = new ScaleBlock("Scale");
    Scale1.visibleInInspector = false;
    Scale1.visibleOnFrame = false;
    Scale1.target = 4;

    // TextureBlock
    var texture = new TextureBlock("Texture");
    texture.visibleInInspector = false;
    texture.visibleOnFrame = false;
    texture.target = 3;
    texture.convertToGammaSpace = undefined;
    texture.convertToLinearSpace = false;
    texture.disableLevelMultiplication = false;
    texture.texture = new Texture(
      "data:octet/stream;base64,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",
      null,
      false,
      false,
      3
    );
    texture.texture.wrapU = 1;
    texture.texture.wrapV = 1;
    texture.texture.uAng = 0;
    texture.texture.vAng = 0;
    texture.texture.wAng = 0;
    texture.texture.uOffset = 0;
    texture.texture.vOffset = 0;
    texture.texture.uScale = 1;
    texture.texture.vScale = 1;
    texture.texture.coordinatesMode = 7;

    // ScaleBlock
    var Scale2 = new ScaleBlock("Scale");
    Scale2.visibleInInspector = false;
    Scale2.visibleOnFrame = false;
    Scale2.target = 4;

    // Rotate2dBlock
    var Rotated = new Rotate2dBlock("Rotate2d");
    Rotated.visibleInInspector = false;
    Rotated.visibleOnFrame = false;
    Rotated.target = 4;

    // VectorMergerBlock
    var VectorMerger = new VectorMergerBlock("VectorMerger");
    VectorMerger.visibleInInspector = false;
    VectorMerger.visibleOnFrame = false;
    VectorMerger.target = 4;
    VectorMerger.xSwizzle = "x";
    VectorMerger.ySwizzle = "y";
    VectorMerger.zSwizzle = "z";
    VectorMerger.wSwizzle = "w";

    // DivideBlock
    var Divide = new DivideBlock("Divide");
    Divide.visibleInInspector = false;
    Divide.visibleOnFrame = false;
    Divide.target = 4;

    // VectorSplitterBlock
    var VectorSplitter = new VectorSplitterBlock("VectorSplitter");
    VectorSplitter.visibleInInspector = false;
    VectorSplitter.visibleOnFrame = false;
    VectorSplitter.target = 4;

    // TransformBlock
    var worldPosviewProjectionTransform = new TransformBlock(
      "worldPos * viewProjectionTransform"
    );
    worldPosviewProjectionTransform.visibleInInspector = false;
    worldPosviewProjectionTransform.visibleOnFrame = false;
    worldPosviewProjectionTransform.target = 1;
    worldPosviewProjectionTransform.complementZ = 0;
    worldPosviewProjectionTransform.complementW = 1;

    // InputBlock
    var viewProjection = new InputBlock("viewProjection");
    viewProjection.visibleInInspector = false;
    viewProjection.visibleOnFrame = false;
    viewProjection.target = 1;
    viewProjection.setAsSystemValue(NodeMaterialSystemValues.ViewProjection);

    // VertexOutputBlock
    var vertexOutput = new VertexOutputBlock("vertexOutput");
    vertexOutput.visibleInInspector = false;
    vertexOutput.visibleOnFrame = false;
    vertexOutput.target = 1;

    // DivideBlock
    var Divide1 = new DivideBlock("Divide");
    Divide1.visibleInInspector = false;
    Divide1.visibleOnFrame = false;
    Divide1.target = 4;

    // DivideBlock
    var Divide2 = new DivideBlock("Divide");
    Divide2.visibleInInspector = false;
    Divide2.visibleOnFrame = false;
    Divide2.target = 4;

    // InputBlock
    var angle = new InputBlock("angle");
    angle.visibleInInspector = false;
    angle.visibleOnFrame = false;
    angle.target = 1;
    angle.value = 0.4;
    angle.min = 0;
    angle.max = 0;
    angle.isBoolean = false;
    angle.matrixMode = 0;
    angle.animationType = AnimatedInputBlockTypes.None;
    angle.isConstant = false;

    // InputBlock
    var InputBlock_56 = new InputBlock("");
    InputBlock_56.visibleInInspector = false;
    InputBlock_56.visibleOnFrame = false;
    InputBlock_56.target = 1;
    InputBlock_56.value = 3;
    InputBlock_56.min = 0;
    InputBlock_56.max = 0;
    InputBlock_56.isBoolean = false;
    InputBlock_56.matrixMode = 0;
    InputBlock_56.animationType = AnimatedInputBlockTypes.None;
    InputBlock_56.isConstant = false;

    // ScaleBlock
    var Scale3 = new ScaleBlock("Scale");
    Scale3.visibleInInspector = false;
    Scale3.visibleOnFrame = false;
    Scale3.target = 4;

    // StepBlock
    var Step = new StepBlock("Step");
    Step.visibleInInspector = false;
    Step.visibleOnFrame = false;
    Step.target = 4;

    // InputBlock
    var DiffuseDimCutoff = new InputBlock("Diffuse Dim Cutoff");
    DiffuseDimCutoff.visibleInInspector = false;
    DiffuseDimCutoff.visibleOnFrame = false;
    DiffuseDimCutoff.target = 1;
    DiffuseDimCutoff.value = 0;
    DiffuseDimCutoff.min = 0;
    DiffuseDimCutoff.max = 0;
    DiffuseDimCutoff.isBoolean = false;
    DiffuseDimCutoff.matrixMode = 0;
    DiffuseDimCutoff.animationType = AnimatedInputBlockTypes.None;
    DiffuseDimCutoff.isConstant = false;

    // MaxBlock
    var Max = new MaxBlock("Max");
    Max.visibleInInspector = false;
    Max.visibleOnFrame = false;
    Max.target = 4;

    // AddBlock
    var AddAmbienttoDiffuseLight = new AddBlock("Add Ambient to Diffuse Light");
    AddAmbienttoDiffuseLight.visibleInInspector = false;
    AddAmbienttoDiffuseLight.visibleOnFrame = false;
    AddAmbienttoDiffuseLight.target = 4;

    // InputBlock
    var AmbientLightColor = new InputBlock("Ambient Light Color");
    AmbientLightColor.visibleInInspector = false;
    AmbientLightColor.visibleOnFrame = false;
    AmbientLightColor.target = 1;
    AmbientLightColor.value = new Color3(
      0.0784313725490196,
      0.0784313725490196,
      0.0784313725490196
    );
    AmbientLightColor.isConstant = false;

    // AddBlock
    var AddRimSpecDiffuseAmbient = new AddBlock(
      "Add Rim + Spec + Diffuse + Ambient"
    );
    AddRimSpecDiffuseAmbient.visibleInInspector = false;
    AddRimSpecDiffuseAmbient.visibleOnFrame = false;
    AddRimSpecDiffuseAmbient.target = 4;

    // ScaleBlock
    var Scale4 = new ScaleBlock("Scale");
    Scale4.visibleInInspector = false;
    Scale4.visibleOnFrame = false;
    Scale4.target = 4;

    // OneMinusBlock
    var Oneminus = new OneMinusBlock("One minus");
    Oneminus.visibleInInspector = false;
    Oneminus.visibleOnFrame = false;
    Oneminus.target = 4;

    // InputBlock
    var RimLightColor = new InputBlock("Rim Light Color");
    RimLightColor.visibleInInspector = false;
    RimLightColor.visibleOnFrame = false;
    RimLightColor.target = 1;
    RimLightColor.value = new Color3(0, 0, 0);
    RimLightColor.isConstant = false;

    // StepBlock
    var QuantizedRimLightIntensity = new StepBlock(
      "Quantized Rim Light Intensity"
    );
    QuantizedRimLightIntensity.visibleInInspector = false;
    QuantizedRimLightIntensity.visibleOnFrame = false;
    QuantizedRimLightIntensity.target = 4;

    // ScaleBlock
    var Scale5 = new ScaleBlock("Scale");
    Scale5.visibleInInspector = false;
    Scale5.visibleOnFrame = false;
    Scale5.target = 4;

    // OneMinusBlock
    var NDotV1 = new OneMinusBlock("1 - N Dot V");
    NDotV1.visibleInInspector = false;
    NDotV1.visibleOnFrame = false;
    NDotV1.target = 4;

    // InputBlock
    var RimIntensity = new InputBlock("Rim Intensity");
    RimIntensity.visibleInInspector = false;
    RimIntensity.visibleOnFrame = false;
    RimIntensity.target = 1;
    RimIntensity.value = 0.6;
    RimIntensity.min = 0;
    RimIntensity.max = 0;
    RimIntensity.isBoolean = false;
    RimIntensity.matrixMode = 0;
    RimIntensity.animationType = AnimatedInputBlockTypes.None;
    RimIntensity.isConstant = false;

    // InputBlock
    var RimCutoff = new InputBlock("Rim Cutoff");
    RimCutoff.visibleInInspector = false;
    RimCutoff.visibleOnFrame = false;
    RimCutoff.target = 1;
    RimCutoff.value = 0.4;
    RimCutoff.min = 0;
    RimCutoff.max = 0;
    RimCutoff.isBoolean = false;
    RimCutoff.matrixMode = 0;
    RimCutoff.animationType = AnimatedInputBlockTypes.None;
    RimCutoff.isConstant = false;

    // OneMinusBlock
    var Oneminus1 = new OneMinusBlock("One minus");
    Oneminus1.visibleInInspector = false;
    Oneminus1.visibleOnFrame = false;
    Oneminus1.target = 4;

    // MultiplyBlock
    var Multiply = new MultiplyBlock("Multiply");
    Multiply.visibleInInspector = false;
    Multiply.visibleOnFrame = false;
    Multiply.target = 4;

    // MultiplyBlock
    var MultiplyLightingbyColor = new MultiplyBlock(
      "Multiply Lighting by Color"
    );
    MultiplyLightingbyColor.visibleInInspector = false;
    MultiplyLightingbyColor.visibleOnFrame = false;
    MultiplyLightingbyColor.target = 4;

    // InputBlock
    var SurfaceColor = new InputBlock("Surface Color");
    SurfaceColor.visibleInInspector = false;
    SurfaceColor.visibleOnFrame = false;
    SurfaceColor.target = 1;
    SurfaceColor.value = new Color3(1, 1, 1);
    SurfaceColor.isConstant = false;

    // FragmentOutputBlock
    var fragmentOutput = new FragmentOutputBlock("fragmentOutput");
    fragmentOutput.visibleInInspector = false;
    fragmentOutput.visibleOnFrame = false;
    fragmentOutput.target = 2;
    fragmentOutput.convertToGammaSpace = undefined;
    fragmentOutput.convertToLinearSpace = undefined;
    fragmentOutput.useLogarithmicDepth = false;

    // InputBlock
    var InputBlock_38 = new InputBlock("");
    InputBlock_38.visibleInInspector = false;
    InputBlock_38.visibleOnFrame = false;
    InputBlock_38.target = 1;
    InputBlock_38.value = 1;
    InputBlock_38.min = 0;
    InputBlock_38.max = 0;
    InputBlock_38.isBoolean = false;
    InputBlock_38.matrixMode = 0;
    InputBlock_38.animationType = AnimatedInputBlockTypes.None;
    InputBlock_38.isConstant = false;

    // NormalizeBlock
    var HNormalized = new NormalizeBlock("H (Normalized)");
    HNormalized.visibleInInspector = false;
    HNormalized.visibleOnFrame = false;
    HNormalized.target = 4;

    // Connections
    position.output.connectTo(worldPos.vector);
    world.output.connectTo(worldPos.transform);
    worldPos.output.connectTo(worldPosviewProjectionTransform.vector);
    viewProjection.output.connectTo(worldPosviewProjectionTransform.transform);
    worldPosviewProjectionTransform.output.connectTo(vertexOutput.vector);
    RimLightColor.output.connectTo(Oneminus.input);
    Oneminus.output.connectTo(Scale4.input);
    normal.output.connectTo(Worldnormal.vector);
    world.output.connectTo(Worldnormal.transform);
    Worldnormal.output.connectTo(N.xyzw);
    N.xyzOut.connectTo(NNormalized.input);
    NNormalized.output.connectTo(NDotV.left);
    worldPos.output.connectTo(Viewdirection.worldPosition);
    cameraPosition.output.connectTo(Viewdirection.cameraPosition);
    Viewdirection.output.connectTo(VNormalized.input);
    VNormalized.output.connectTo(NDotV.right);
    NDotV.output.connectTo(NDotV1.input);
    NDotV1.output.connectTo(Scale5.input);
    RimIntensity.output.connectTo(Scale5.factor);
    Scale5.output.connectTo(QuantizedRimLightIntensity.value);
    RimCutoff.output.connectTo(QuantizedRimLightIntensity.edge);
    QuantizedRimLightIntensity.output.connectTo(Scale4.factor);
    Scale4.output.connectTo(Oneminus1.input);
    Oneminus1.output.connectTo(Multiply.left);
    AmbientLightColor.output.connectTo(AddAmbienttoDiffuseLight.left);
    DiffuseLightColor.output.connectTo(BrightLightCalculation.input);
    InputBlock_38.output.connectTo(BrightLightCalculation.factor);
    BrightLightCalculation.output.connectTo(Scale.input);
    NNormalized.output.connectTo(NDotLDiffuseLightIntensity.left);
    worldPos.output.connectTo(Lightinformation.worldPosition);
    Lightinformation.direction.connectTo(LNormalized.input);
    LNormalized.output.connectTo(NDotLDiffuseLightIntensity.right);
    NDotLDiffuseLightIntensity.output.connectTo(
      QuantizedDiffuseLightIntensity.value
    );
    DiffuseBrightCutoff.output.connectTo(QuantizedDiffuseLightIntensity.edge);
    QuantizedDiffuseLightIntensity.output.connectTo(Scale.factor);
    Scale.output.connectTo(Max.left);
    DiffuseLightColor.output.connectTo(Scale1.input);
    worldPosviewProjectionTransform.output.connectTo(VectorSplitter.xyzw);
    VectorSplitter.x.connectTo(Divide.left);
    VectorSplitter.w.connectTo(Divide.right);
    Divide.output.connectTo(VectorMerger.x);
    VectorSplitter.y.connectTo(Divide1.left);
    VectorSplitter.w.connectTo(Divide1.right);
    Divide1.output.connectTo(VectorMerger.y);
    VectorSplitter.z.connectTo(Divide2.left);
    VectorSplitter.w.connectTo(Divide2.right);
    Divide2.output.connectTo(VectorMerger.z);
    VectorMerger.xy.connectTo(Rotated.input);
    angle.output.connectTo(Rotated.angle);
    Rotated.output.connectTo(Scale2.input);
    InputBlock_56.output.connectTo(Scale2.factor);
    Scale2.output.connectTo(texture.uv);
    texture.r.connectTo(Scale1.factor);
    Scale1.output.connectTo(Scale3.input);
    NDotLDiffuseLightIntensity.output.connectTo(Step.value);
    DiffuseDimCutoff.output.connectTo(Step.edge);
    Step.output.connectTo(Scale3.factor);
    Scale3.output.connectTo(Max.right);
    Max.output.connectTo(AddAmbienttoDiffuseLight.right);
    AddAmbienttoDiffuseLight.output.connectTo(AddRimSpecDiffuseAmbient.left);
    Scale4.output.connectTo(AddRimSpecDiffuseAmbient.right);
    AddRimSpecDiffuseAmbient.output.connectTo(MultiplyLightingbyColor.left);
    SurfaceColor.output.connectTo(MultiplyLightingbyColor.right);
    MultiplyLightingbyColor.output.connectTo(Multiply.right);
    Multiply.output.connectTo(fragmentOutput.rgb);

    // Output nodes
    nodeMaterial.addOutputNode(vertexOutput);
    nodeMaterial.addOutputNode(fragmentOutput);
    nodeMaterial.build();

    return nodeMaterial;
  }
}
