import {
	Project,
	VariableDeclaration,
	SourceFile,
	SyntaxKind,
	Scope
} from "ts-morph";
import logger from "../logger/logger";
import {log} from "util";

export function addAnyToVars( tsAstProject: Project ): Project {
	logger.verbose( 'Beginning routine to mark function parameters as optional when calls exist that supply fewer args than parameters...' );
	const sourceFiles = tsAstProject.getSourceFiles();

	logger.verbose( 'Parsing function/method/constructor calls from codebase.' );
	addAny( sourceFiles );

	return tsAstProject;
}




/**
 * Finds the call sites of each FunctionDeclaration or MethodDeclaration in
 * order to determine if any of its parameters should be marked as optional.
 *
 * Returns a Map keyed by FunctionDeclaration or MethodDeclaration which contains
 * the minimum number of arguments passed to that function/method.
 *
 * Actually marking the parameters as optional is done in a separate phase.
 */
function addAny( sourceFiles: SourceFile[] ): void {
	logger.verbose( 'Finding all calls to functions/methods...' );
	for(const sourceFile of sourceFiles) {
		let vars = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration) as VariableDeclaration[];
		for (const oneVar of vars) {
			try{
			oneVar.setType("any");
			}catch(e){
				logger.error(oneVar.getSourceFile().getFilePath() + ":" + oneVar.getPos() + "  -  " + oneVar.getName())
			}
		}
	}
}


